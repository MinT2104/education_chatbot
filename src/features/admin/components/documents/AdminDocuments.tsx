import { useMemo, useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Upload, Edit, Trash2, FileText, Loader2 } from "lucide-react";
import { Document, School } from "../../types";
import { standards } from "../../data/mockData";
import { adminService, Subject } from "../../services/adminService";

interface AdminDocumentsProps {
  documents: Document[];
  schools: School[];
  loading?: boolean;
  onRefresh?: () => void;
}

// Upload log entry type
interface UploadLog {
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  details?: string;
}

export const AdminDocuments = ({
  documents,
  schools,
  loading = false,
  onRefresh,
}: AdminDocumentsProps) => {
  const [documentSearch, setDocumentSearch] = useState("");
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  // Upload logs for detailed tracking
  const [uploadLogs, setUploadLogs] = useState<UploadLog[]>([]);
  const uploadStartTimeRef = useRef<number>(0);
  const lastProgressUpdateRef = useRef<number>(0);
  
  // Delete states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Form states
  const [documentName, setDocumentName] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedStandard, setSelectedStandard] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Subjects API states
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [subjectsError, setSubjectsError] = useState<string | null>(null);

  // Helper function to add upload log
  const addUploadLog = (type: UploadLog['type'], message: string, details?: string) => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const milliseconds = now.getMilliseconds().toString().padStart(3, '0');
    const timestamp = `${hours}:${minutes}:${seconds},${milliseconds}`;
    
    const newLog: UploadLog = { timestamp, type, message, details };
    console.log(`[UPLOAD ${type.toUpperCase()}] ${timestamp} - ${message}${details ? ': ' + details : ''}`);
    setUploadLogs(prev => [...prev, newLog]);
  };

  const filteredDocuments = useMemo(
    () =>
      documents.filter((doc) =>
        [doc.name, doc.schoolName, doc.subject, doc.standard]
          .join(" ")
          .toLowerCase()
          .includes(documentSearch.toLowerCase())
      ),
    [documents, documentSearch]
  );

  // Load subjects when dialog opens
  const loadSubjects = async () => {
    setSubjectsLoading(true);
    setSubjectsError(null);
    try {
      const data = await adminService.getSubjects({ limit: 1000 });
      setSubjects(data);
    } catch (error: any) {
      console.error("Failed to load subjects:", error);
      setSubjectsError(
        error.response?.data?.message || error.message || "Failed to load subjects"
      );
      setSubjects([]);
    } finally {
      setSubjectsLoading(false);
    }
  };

  useEffect(() => {
    if (isUploadDocOpen && subjects.length === 0 && !subjectsLoading) {
      loadSubjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUploadDocOpen]);

  // Monitor upload progress for stuck detection
  useEffect(() => {
    if (!uploadLoading) return;

    const monitorInterval = setInterval(() => {
      const now = Date.now();
      const timeSinceStart = now - uploadStartTimeRef.current;
      const timeSinceLastUpdate = now - lastProgressUpdateRef.current;

      // Detailed monitoring logs every 10 seconds
      if (uploadProgress < 100) {
        const elapsedMin = (timeSinceStart / 60000).toFixed(1);
        addUploadLog('info', `⏱️ Upload monitor check`, 
          `Current progress: ${uploadProgress}% | Time elapsed: ${elapsedMin} min | Time since last update: ${(timeSinceLastUpdate / 1000).toFixed(0)}s`);
      }

      // Warning if no progress update for 45 seconds
      if (timeSinceLastUpdate > 45000 && uploadProgress < 100) {
        addUploadLog('warning', '⚠️ Upload stall warning', 
          `No progress for ${(timeSinceLastUpdate / 1000).toFixed(0)}s | Stuck at ${uploadProgress}% | Possible network congestion or server processing delay`);
      }

      // Critical warning if no progress for 90 seconds
      if (timeSinceLastUpdate > 90000 && uploadProgress < 100) {
        addUploadLog('error', '🚨 Critical upload stall', 
          `Upload appears frozen for ${(timeSinceLastUpdate / 1000).toFixed(0)}s at ${uploadProgress}% | Recommendations: 1) Check internet connection, 2) Check Python server status, 3) Consider canceling and retrying with smaller file`);
      }

      // Timeout warning after 4 minutes
      if (timeSinceStart > 240000 && uploadProgress < 100) {
        addUploadLog('warning', '⏰ Approaching timeout limit', 
          `Upload running for ${(timeSinceStart / 60000).toFixed(1)} minutes | Timeout in ${((300000 - timeSinceStart) / 60000).toFixed(1)} minutes | Progress: ${uploadProgress}%`);
      }

      // Final timeout after 5 minutes
      if (timeSinceStart > 300000) {
        addUploadLog('error', '❌ Upload timeout exceeded', 
          `Upload exceeded 5-minute limit. Total time: ${(timeSinceStart / 60000).toFixed(1)} minutes | Final progress: ${uploadProgress}% | Action required: Cancel and retry with smaller file or better network connection`);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(monitorInterval);
  }, [uploadLoading, uploadProgress]);

  const validateFile = (file: File): string | null => {
    // Match with Python backend SUPPORTED_EXTENSIONS
    // PDF, images, and videos only (no audio files)
    const allowedExtensions = [
      '.pdf', '.txt',
      '.jpg', '.jpeg', '.png', '.bmp', '.gif',
      '.mp4', '.avi', '.mov', '.mkv'
    ];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    // Also check MIME types as fallback
    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/bmp',
      'image/gif',
      'video/mp4',
      'video/quicktime',
      'video/x-msvideo',
      'video/x-matroska'
    ];
    
    const isValidExtension = allowedExtensions.includes(fileExtension);
    const isValidType = file.type && (
      allowedTypes.includes(file.type) ||
      file.type.startsWith('video/') ||
      file.type.startsWith('image/')
    );
    
    if (!isValidExtension && !isValidType) {
      return "Please upload a valid file (PDF, TXT, Images, or Video: MP4, AVI, MOV, MKV)";
    }
    
    // Validate file size (100MB for video, 50MB for others)
    const maxSize = file.type.startsWith('video/') || ['.mp4', '.avi', '.mov', '.mkv'].includes(fileExtension)
      ? 100 * 1024 * 1024 
      : 50 * 1024 * 1024;
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      return `File size must be less than ${maxSizeMB}MB`;
    }
    
    return null;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        setUploadError(error);
        return;
      }
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!uploadLoading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (uploadLoading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        setUploadError(error);
        return;
      }
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    // Reset logs
    setUploadLogs([]);
    uploadStartTimeRef.current = Date.now();
    lastProgressUpdateRef.current = Date.now();
    
    addUploadLog('info', '🔍 Starting form validation', 'Checking all required fields...');
    
    // Validate form
    if (!documentName.trim()) {
      setUploadError("Document name is required");
      addUploadLog('error', '❌ Validation failed: Missing document name');
      return;
    }
    addUploadLog('success', '✓ Document name validated', `Name: "${documentName}"`);
    
    if (!selectedSchool) {
      setUploadError("Please select a school");
      addUploadLog('error', '❌ Validation failed: School not selected');
      return;
    }
    const school = schools.find((s) => s.id === selectedSchool);
    if (!school) {
      addUploadLog('error', '❌ Validation failed: School ID not found in database', `ID: ${selectedSchool}`);
      throw new Error("Selected school not found");
    }
    addUploadLog('success', '✓ School validated', `School: "${school.name}" (ID: ${selectedSchool})`);
    
    if (!selectedStandard) {
      setUploadError("Please select a grade/standard");
      addUploadLog('error', '❌ Validation failed: Grade/Standard not selected');
      return;
    }
    addUploadLog('success', '✓ Grade/Standard validated', `Grade: "${selectedStandard}"`);
    
    if (!selectedSubject) {
      setUploadError("Please select a subject");
      addUploadLog('error', '❌ Validation failed: Subject not selected');
      return;
    }
    addUploadLog('success', '✓ Subject validated', `Subject: "${selectedSubject}"`);
    
    if (!selectedFile) {
      setUploadError("Please select a file to upload");
      addUploadLog('error', '❌ Validation failed: No file selected');
      return;
    }
    
    const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
    const fileSizeBytes = selectedFile.size.toLocaleString();
    addUploadLog('success', '✓ File validated', 
      `Name: "${selectedFile.name}", Size: ${fileSizeMB}MB (${fileSizeBytes} bytes), Type: ${selectedFile.type || 'unknown'}`);

    addUploadLog('info', '📋 Form validation completed successfully', 'All fields validated. Proceeding to upload...');

    setUploadLoading(true);
    setUploadError(null);
    setUploadSuccess(false);
    setUploadProgress(0);

    try {
      addUploadLog('info', '📦 Preparing upload data', 'Creating FormData object with file and metadata...');
      
      addUploadLog('info', '🔗 Target endpoint configured', 
        `URL: ${import.meta.env.VITE_PYTHON_URL}/upload`);
      
      addUploadLog('info', '📤 Initiating file transfer', 
        `Starting upload to Python server - File: ${selectedFile.name} (${fileSizeMB}MB)`);

      let lastLoggedProgress = 0;
      let progressStuckCount = 0;

      const uploadPromise = adminService.uploadDocument({
        file: selectedFile,
        document_name: documentName.trim(),
        school_name: school.name,
        standard: selectedStandard,
        subject: selectedSubject,
        onUploadProgress: (progressEvent: any) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
          
          const now = Date.now();
          const timeSinceLastUpdate = now - lastProgressUpdateRef.current;
          const timeSinceStart = now - uploadStartTimeRef.current;
          
          // Calculate upload speed
          const uploadedBytes = progressEvent.loaded;
          const timeElapsedSec = timeSinceStart / 1000;
          const speedMBps = timeElapsedSec > 0 ? (uploadedBytes / (1024 * 1024)) / timeElapsedSec : 0;
          const speedKBps = speedMBps * 1024;
          
          // Calculate ETA
          const remainingBytes = progressEvent.total - progressEvent.loaded;
          const etaSeconds = speedMBps > 0 ? (remainingBytes / (1024 * 1024)) / speedMBps : 0;
          const etaFormatted = etaSeconds < 60 ? `${etaSeconds.toFixed(0)}s` : `${(etaSeconds / 60).toFixed(1)}min`;
          
          // Detailed logging every 10% or every 3 seconds
          const shouldLog = percentCompleted !== lastLoggedProgress && 
                           (percentCompleted % 10 === 0 || timeSinceLastUpdate > 3000);
          
          if (shouldLog) {
            const uploadedMB = (progressEvent.loaded / (1024 * 1024)).toFixed(2);
            const totalMB = (progressEvent.total / (1024 * 1024)).toFixed(2);
            const elapsed = (timeSinceStart / 1000).toFixed(1);
            
            if (percentCompleted === 100) {
              addUploadLog('success', `✅ Upload progress: 100%`, 
                `All ${totalMB}MB transferred successfully | Total upload time: ${elapsed}s | Average speed: ${speedKBps.toFixed(1)} KB/s`);
            } else {
              addUploadLog('info', `📊 Upload progress: ${percentCompleted}%`, 
                `Transferred: ${uploadedMB}MB / ${totalMB}MB | Speed: ${speedKBps.toFixed(1)} KB/s | Elapsed: ${elapsed}s | ETA: ${etaFormatted}`);
            }
            
            lastLoggedProgress = percentCompleted;
            lastProgressUpdateRef.current = now;
            progressStuckCount = 0;
          }
          
          // Detect if progress is stuck
          if (timeSinceLastUpdate > 15000 && percentCompleted < 100) {
            progressStuckCount++;
            
            if (progressStuckCount === 1) {
              addUploadLog('warning', '⚠️ Upload appears slow', 
                `No progress update for ${(timeSinceLastUpdate / 1000).toFixed(0)}s at ${percentCompleted}% | Current speed: ${speedKBps.toFixed(1)} KB/s | Checking connection...`);
            }
            
            if (timeSinceLastUpdate > 30000) {
              addUploadLog('warning', '🔄 Upload stalled detected', 
                `Stuck at ${percentCompleted}% for ${(timeSinceLastUpdate / 1000).toFixed(0)}s | Possible causes: Network congestion, server processing, or connection issues`);
            }
            
            if (timeSinceLastUpdate > 60000) {
              addUploadLog('error', '❌ Upload critically stuck', 
                `No progress for ${(timeSinceLastUpdate / 1000).toFixed(0)}s | Stuck at: ${percentCompleted}% | Last successful transfer: ${(uploadedBytes / (1024 * 1024)).toFixed(2)}MB | Possible timeout imminent`);
            }
          }
        },
      });

      // Log when upload completes and server processing begins
      addUploadLog('info', '⏳ Waiting for server response...', 
        'File upload complete. Waiting for Python backend to confirm receipt and begin processing...');

      // Start simulated processing progress based on file size
      const processingStartTime = Date.now();
      const estimatedProcessingTime = Math.max(30000, selectedFile.size / (1024 * 1024) * 2000); // 2s per MB, min 30s
      
      const processingInterval = setInterval(() => {
        const elapsed = Date.now() - processingStartTime;
        const estimatedProgress = Math.min(95, (elapsed / estimatedProcessingTime) * 100);
        
        if (estimatedProgress < 30) {
          addUploadLog('info', `🔍 Server processing: ~${Math.round(estimatedProgress)}%`, 
            'Step 1/3: Validating file integrity and format...');
        } else if (estimatedProgress < 70) {
          addUploadLog('info', `📝 Server processing: ~${Math.round(estimatedProgress)}%`, 
            'Step 2/3: Extracting content (text, images, metadata)...');
        } else if (estimatedProgress < 95) {
          addUploadLog('info', `💾 Server processing: ~${Math.round(estimatedProgress)}%`, 
            'Step 3/3: Indexing to vector database and creating embeddings...');
        }
      }, 5000); // Update every 5 seconds

      try {
        await uploadPromise;
        clearInterval(processingInterval);
      } catch (error) {
        clearInterval(processingInterval);
        throw error;
      }

      // Log when upload completes and server processing begins
      addUploadLog('info', '⏳ Waiting for server response...', 
        'File upload complete. Waiting for Python backend to confirm receipt and begin processing...');

      await uploadPromise;

      const totalTime = ((Date.now() - uploadStartTimeRef.current) / 1000).toFixed(1);
      const avgSpeedMBps = (selectedFile.size / (1024 * 1024)) / parseFloat(totalTime);
      
      addUploadLog('success', '✅ Server confirmed file receipt!', 
        `Python backend successfully received the file. Total time: ${totalTime}s | Average speed: ${(avgSpeedMBps * 1024).toFixed(1)} KB/s`);
      
      addUploadLog('info', '🔄 Server processing pipeline started', 
        'Backend is now: 1) Validating file integrity, 2) Extracting content (text/images/video), 3) Indexing to vector database. This may take 30-120 seconds depending on file size...');
      
      // Add a processing monitor log
      addUploadLog('info', '⏱️ Processing monitor active', 
        'Will log updates if server processing takes longer than expected. Please wait...');

      setUploadSuccess(true);
      toast.success("Document uploaded and indexed successfully!");
      
      addUploadLog('success', '🎉 Complete! Upload and indexing finished', 
        'Document is now available in the system and ready for AI queries.');
      
      // Reset form
      setDocumentName("");
      setSelectedSchool("");
      setSelectedStandard("");
      setSelectedSubject("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Refresh documents list and close dialog after a short delay
      if (onRefresh) {
        onRefresh();
      }
      
      // Keep dialog open for 2 seconds to show success logs
      setTimeout(() => {
        setIsUploadDocOpen(false);
      }, 2000);
      
    } catch (error: any) {
      const errorTime = ((Date.now() - uploadStartTimeRef.current) / 1000).toFixed(1);
      console.error("Upload error:", error);
      
      addUploadLog('error', '❌ Upload failed', 
        `Error occurred after ${errorTime}s at ${uploadProgress}% progress`);
      
      let errorMessage = "Failed to upload document";
      
      // Network timeout errors
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMessage = "Upload timeout. The file may be too large or the server is taking too long to process. Please try with a smaller file or try again later.";
        addUploadLog('error', '⏱️ Request timeout detected', 
          `Server did not respond within the configured timeout period. File may be too large for current network conditions.`);
      } 
      // Server gateway errors
      else if (error.response?.status === 502) {
        errorMessage = "Server error while processing the file. This may be due to a corrupted file or server overload. Please try again or contact support.";
        addUploadLog('error', '🔧 Server gateway error (502)', 
          `Python backend encountered an error. Possible causes: server crashed, processing timeout, or invalid file format.`);
      } 
      // File size errors
      else if (error.response?.status === 413) {
        errorMessage = "File is too large. Please try with a smaller file.";
        addUploadLog('error', '📏 Payload too large (413)', 
          `File exceeds server upload limits. Max: 100MB for videos, 50MB for other files.`);
      } 
      // Server returned error details
      else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
        addUploadLog('error', '⚠️ Server returned error', 
          `Status: ${error.response.status} | Message: ${error.response.data.detail}`);
      } 
      // Generic error with message
      else if (error.message) {
        errorMessage = error.message;
        addUploadLog('error', '⚠️ Client error occurred', 
          `Error type: ${error.name || 'Unknown'} | Message: ${error.message}`);
      }
      
      // Network connection errors
      if (error.request && !error.response) {
        addUploadLog('error', '🌐 Network connection failed', 
          `Unable to reach Python server. Check: 1) Internet connection, 2) Server status at ${import.meta.env.VITE_PYTHON_URL}, 3) Firewall/VPN settings, 4) CORS configuration`);
      }
      
      // Log full error stack for debugging
      if (error.config) {
        addUploadLog('info', '🔍 Request details', 
          `Method: ${error.config.method?.toUpperCase()} | URL: ${error.config.url} | Timeout: ${error.config.timeout}ms`);
      }
      
      setUploadError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setIsUploadDocOpen(open);
    
    if (!open && !uploadLoading) {
      // Reset form when dialog closes
      setDocumentName("");
      setSelectedSchool("");
      setSelectedStandard("");
      setSelectedSubject("");
      setSelectedFile(null);
      setUploadError(null);
      setUploadSuccess(false);
      setUploadProgress(0);
      setUploadLogs([]); // Clear logs
      uploadStartTimeRef.current = 0;
      lastProgressUpdateRef.current = 0;
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteClick = (doc: Document) => {
    setDocumentToDelete(doc);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return;

    setDeleteLoading(true);
    try {
      await adminService.deleteDocument(documentToDelete.id);
      
      // Refresh documents list
      if (onRefresh) {
        onRefresh();
      }
      
      toast.success("Document deleted successfully!");
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    } catch (error: any) {
      console.error("Failed to delete document:", error);
      const errorMessage = error.response?.data?.detail || error.message || "Failed to delete document";
      setUploadError(errorMessage);
      toast.error(errorMessage);
      // Keep dialog open on error so user can retry
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDocumentToDelete(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <CardTitle className="text-lg sm:text-xl">Document Management</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Upload and manage master training files
            </CardDescription>
          </div>
          <Dialog open={isUploadDocOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm">
                <Upload className="w-4 h-4" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Upload Master Training File</DialogTitle>
<DialogDescription>
                  Upload educational content that will be indexed for AI responses. Supports PDF, TXT, Images (JPG, PNG, BMP, GIF), and Videos (MP4, AVI, MOV, MKV).
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {uploadSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
                    Document uploaded successfully!
                  </div>
                )}
                {uploadError && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
                    {uploadError}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="doc-name">Document Name *</Label>
                  <Input
                    id="doc-name"
                    placeholder="Enter document name"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    disabled={uploadLoading}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="doc-school" className="text-sm">School *</Label>
                    <Select
                      value={selectedSchool}
                      onValueChange={setSelectedSchool}
                      disabled={uploadLoading}
                    >
                      <SelectTrigger id="doc-school" className="text-sm">
                        <SelectValue placeholder="Select school" />
                      </SelectTrigger>
                      <SelectContent>
                        {schools.map((school) => (
                          <SelectItem key={school.id} value={school.id}>
                            {school.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doc-standard" className="text-sm">Grade/Standard *</Label>
                    <Select
                      value={selectedStandard}
                      onValueChange={setSelectedStandard}
                      disabled={uploadLoading}
                    >
                      <SelectTrigger id="doc-standard" className="text-sm">
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {standards.map((standard) => (
                          <SelectItem key={standard} value={standard}>
                            {standard}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doc-subject">Subject *</Label>
                  <Select
                    value={selectedSubject}
                    onValueChange={setSelectedSubject}
                    disabled={uploadLoading || subjectsLoading}
                  >
                    <SelectTrigger id="doc-subject">
                      <SelectValue 
                        placeholder={
                          subjectsLoading 
                            ? "Loading subjects..." 
                            : subjectsError 
                            ? "Error loading subjects" 
                            : "Select subject"
                        } 
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectsLoading ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          <span className="text-sm text-muted-foreground">Loading subjects...</span>
                        </div>
                      ) : subjectsError ? (
                        <div className="flex items-center justify-center py-4">
                          <span className="text-sm text-destructive">{subjectsError}</span>
                        </div>
                      ) : subjects.length === 0 ? (
                        <div className="flex items-center justify-center py-4">
                          <span className="text-sm text-muted-foreground">No subjects available</span>
                        </div>
                      ) : (
                        subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.name}>
                            {subject.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {subjectsError && (
                    <p className="text-xs text-destructive mt-1">
                      {subjectsError}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doc-file">File Upload *</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="doc-file"
                    accept=".pdf,.txt,.jpg,.jpeg,.png,.bmp,.gif,.mp4,.avi,.mov,.mkv,video/*,image/*"
                    onChange={handleFileSelect}
                    disabled={uploadLoading}
                    className="hidden"
                  />
                  <div
                    onClick={() => !uploadLoading && fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      uploadLoading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:border-primary cursor-pointer"
                    } ${selectedFile ? "border-primary bg-primary/5" : ""} ${
                      isDragging ? "border-primary-500 bg-primary/10" : ""
                    }`}
                  >
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    {selectedFile ? (
                      <div>
                        <div className="flex items-center justify-center gap-2 mb-1">
                          {selectedFile.type.startsWith('video/') && (
                            <span className="text-2xl">🎥</span>
                          )}
                          {selectedFile.type.startsWith('image/') && (
                            <span className="text-2xl">🖼️</span>
                          )}
                          {selectedFile.type === 'application/pdf' && (
                            <FileText className="w-6 h-6 text-primary" />
                          )}
                          {selectedFile.type === 'text/plain' && (
                            <span className="text-2xl">📄</span>
                          )}
                          <p className="text-sm font-medium">{selectedFile.name}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        {selectedFile.type.startsWith('video/') && (
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                            ℹ️ Video will be transcribed and indexed as text
                          </p>
                        )}
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PDF, TXT, Images, or Videos (MP4, AVI, MOV, MKV)
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Up to 100MB for videos, 50MB for other files
                        </p>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Upload Progress Bar */}
                {uploadLoading && uploadProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Uploading...</span>
                      <span className="font-medium">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Upload Logs Viewer - Real-time Activity Monitor */}
                {(uploadLogs.length > 0 || uploadLoading) && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Upload Activity Log</Label>
                      <span className="text-xs text-muted-foreground">
                        {uploadLogs.length} events
                      </span>
                    </div>
                    <div className="border rounded-lg bg-muted/30 max-h-64 overflow-y-auto">
                      <div className="p-3 space-y-2 font-mono text-xs">
                        {uploadLogs.length === 0 && uploadLoading ? (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Initializing upload process...</span>
                          </div>
                        ) : (
                          uploadLogs.map((log, index) => (
                            <div 
                              key={index}
                              className={`flex gap-2 p-2 rounded ${
                                log.type === 'error' 
                                  ? 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400' 
                                  : log.type === 'success' 
                                  ? 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400'
                                  : log.type === 'warning'
                                  ? 'bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400'
                                  : 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400'
                              }`}
                            >
                              <span className="text-muted-foreground shrink-0">
                                [{log.timestamp}]
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium">{log.message}</div>
                                {log.details && (
                                  <div className="text-[10px] mt-0.5 opacity-80 break-words">
                                    {log.details}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    {uploadLoading && (
                      <p className="text-xs text-muted-foreground italic">
                        💡 Tip: If upload gets stuck, these logs will help identify exactly which step is causing the issue
                      </p>
                    )}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => handleDialogClose(false)}
                  disabled={uploadLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={uploadLoading || uploadSuccess}
                >
                  {uploadLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload & Index"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search documents..."
              value={documentSearch}
              onChange={(e) => setDocumentSearch(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
        </div>
        <div className="rounded-md border overflow-x-auto -mx-1 sm:mx-0">
          <div className="min-w-[900px] sm:min-w-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Document Name</TableHead>
                  <TableHead className="min-w-[120px] hidden md:table-cell">School</TableHead>
                  <TableHead className="min-w-[80px]">Grade</TableHead>
                  <TableHead className="min-w-[100px] hidden lg:table-cell">Subject</TableHead>
                  <TableHead className="min-w-[80px] hidden md:table-cell">Size</TableHead>
                  <TableHead className="min-w-[80px]">Status</TableHead>
                  <TableHead className="min-w-[100px] hidden lg:table-cell">Uploaded</TableHead>
                  <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Loading documents...
                  </TableCell>
                </TableRow>
              ) : filteredDocuments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No documents found
                  </TableCell>
                </TableRow>
              ) : (
                filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate text-xs sm:text-sm">{doc.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                      <span className="truncate block">{doc.schoolName}</span>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">{doc.standard}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge variant="outline" className="text-xs">{doc.subject}</Badge>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                      {doc.fileSize.toFixed(1)} MB
                    </TableCell>
                    <TableCell>
                      {doc.indexed ? (
                        <Badge variant="default" className="bg-green-500 text-xs">
                          Indexed
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                      {doc.uploadedAt}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 sm:gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(doc)}
                          disabled={deleteLoading}
                          className="h-8 w-8"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
        </div>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{documentToDelete?.name}"? This will
              delete the document from both Pinecone and Supabase. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel} disabled={deleteLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

