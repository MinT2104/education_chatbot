/**
 * Chunked Upload Service
 * Handles uploading large files in chunks with automatic retry and progress tracking
 */

import axios, { AxiosProgressEvent } from 'axios';

const PYTHON_API_URL = import.meta.env.VITE_PYTHON_URL || 'http://localhost:8000';
const DEFAULT_CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 1000; // 1 second

interface ChunkUploadOptions {
    file: File;
    uploadId: string;
    documentId: string;
    metadata: {
        document_name: string;
        school_name: string;
        standard: string;
        subject: string;
    };
    chunkSize?: number;
    maxRetries?: number;
    onChunkProgress?: (chunkIndex: number, progress: number) => void;
    onChunkComplete?: (chunkIndex: number, total: number) => void;
    onChunkError?: (chunkIndex: number, error: Error, willRetry: boolean, attempt: number) => void;
    onOverallProgress?: (percent: number, uploadedChunks: number, totalChunks: number) => void;
    onLog?: (type: 'info' | 'success' | 'warning' | 'error', message: string, details?: string) => void;
}

interface ChunkUploadResult {
    success: boolean;
    document_id: string;
    status: number;
    message: string;
}

export class ChunkedUploadService {
    private chunkSize: number;
    private maxRetries: number;

    constructor(chunkSize: number = DEFAULT_CHUNK_SIZE, maxRetries: number = MAX_RETRIES) {
        this.chunkSize = chunkSize;
        this.maxRetries = maxRetries;
    }

    /**
     * Main method to upload a file in chunks
     */
    async uploadFileInChunks(options: ChunkUploadOptions): Promise<ChunkUploadResult> {
        const { file, onLog } = options;
        const chunkSize = options.chunkSize || this.chunkSize;

        onLog?.('info', '🧩 Starting chunked upload', `File: ${file.name}, Size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);

        // Split file into chunks
        const chunks = this.splitFileIntoChunks(file, chunkSize);
        const totalChunks = chunks.length;

        onLog?.('info', `📦 File split into ${totalChunks} chunks`, `Chunk size: ${(chunkSize / (1024 * 1024)).toFixed(2)}MB`);

        // Upload each chunk sequentially with retry
        for (let i = 0; i < chunks.length; i++) {
            await this.uploadChunkWithRetry(chunks[i], i, totalChunks, options);

            // Update overall progress
            const overallProgress = Math.round(((i + 1) / totalChunks) * 100);
            options.onOverallProgress?.(overallProgress, i + 1, totalChunks);
        }

        // Finalize upload (merge chunks on server)
        onLog?.('info', '🔗 All chunks uploaded, finalizing...', 'Merging chunks on server');

        const result = await this.finalizeUpload(options);

        onLog?.('success', '✅ Upload complete!', `Document ID: ${result.document_id}`);

        return result;
    }

    /**
     * Split file into chunks
     */
    private splitFileIntoChunks(file: File, chunkSize: number): Blob[] {
        const chunks: Blob[] = [];
        let offset = 0;

        while (offset < file.size) {
            const end = Math.min(offset + chunkSize, file.size);
            chunks.push(file.slice(offset, end));
            offset = end;
        }

        return chunks;
    }

    /**
     * Upload a single chunk with retry logic
     */
    private async uploadChunkWithRetry(
        chunk: Blob,
        chunkIndex: number,
        totalChunks: number,
        options: ChunkUploadOptions,
        attempt: number = 1
    ): Promise<void> {
        const { uploadId, onChunkComplete, onChunkError, onLog } = options;

        try {
            await this.uploadSingleChunk(chunk, chunkIndex, totalChunks, uploadId, options);

            // Success
            onChunkComplete?.(chunkIndex, totalChunks);
            onLog?.('success', `✓ Chunk ${chunkIndex + 1}/${totalChunks}`, `Uploaded successfully`);

        } catch (error) {
            const willRetry = attempt < this.maxRetries;
            onChunkError?.(chunkIndex, error as Error, willRetry, attempt);

            if (willRetry) {
                // Exponential backoff
                const delay = RETRY_DELAY_BASE * Math.pow(2, attempt - 1);
                onLog?.('warning', `⚠ Chunk ${chunkIndex + 1} failed (attempt ${attempt}/${this.maxRetries})`,
                    `Retrying in ${delay / 1000}s... Error: ${(error as Error).message}`);

                await this.delay(delay);
                return this.uploadChunkWithRetry(chunk, chunkIndex, totalChunks, options, attempt + 1);
            } else {
                // Max retries exceeded
                onLog?.('error', `✗ Chunk ${chunkIndex + 1} failed after ${this.maxRetries} attempts`,
                    `Error: ${(error as Error).message}`);
                throw new Error(`Chunk ${chunkIndex + 1} upload failed after ${this.maxRetries} attempts: ${(error as Error).message}`);
            }
        }
    }

    /**
     * Upload a single chunk to the server
     */
    private async uploadSingleChunk(
        chunk: Blob,
        chunkIndex: number,
        totalChunks: number,
        uploadId: string,
        options: ChunkUploadOptions
    ): Promise<void> {
        const formData = new FormData();
        formData.append('chunk', chunk, `chunk_${chunkIndex}`);
        formData.append('upload_id', uploadId);
        formData.append('chunk_index', chunkIndex.toString());
        formData.append('total_chunks', totalChunks.toString());

        const { onChunkProgress } = options;

        await axios.post(`${PYTHON_API_URL}/upload/chunk`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 60000, // 60 seconds per chunk
            onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                if (progressEvent.total) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onChunkProgress?.(chunkIndex, percentCompleted);
                }
            },
        });
    }

    /**
     * Finalize upload by merging chunks on server
     */
    private async finalizeUpload(options: ChunkUploadOptions): Promise<ChunkUploadResult> {
        const { file, uploadId, documentId, metadata } = options;
        const totalChunks = Math.ceil(file.size / this.chunkSize);

        const response = await axios.post(`${PYTHON_API_URL}/upload/finalize`, {
            upload_id: uploadId,
            document_id: documentId,
            document_name: metadata.document_name,
            school_name: metadata.school_name,
            standard: metadata.standard,
            subject: metadata.subject,
            total_chunks: totalChunks,
            original_filename: file.name,
            file_hash: null, // Optional: calculate client-side hash for integrity check
        }, {
            timeout: 300000, // 5 minutes for processing
        });

        return response.data;
    }

    /**
     * Delay helper for retry backoff
     */
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Generate a unique upload ID
     */
    static generateUploadId(): string {
        return `upload_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    }
}

/**
 * Determine if file should use chunked upload
 */
export function shouldUseChunkedUpload(file: File): boolean {
    const THRESHOLD_MB = parseInt(import.meta.env.VITE_FALLBACK_SINGLE_UPLOAD_MB || '10');
    const thresholdBytes = THRESHOLD_MB * 1024 * 1024;
    return file.size > thresholdBytes;
}
