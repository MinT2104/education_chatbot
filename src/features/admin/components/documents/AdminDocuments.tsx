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
    // Validate form
    if (!documentName.trim()) {
      setUploadError("Document name is required");
      return;
    }
    if (!selectedSchool) {
      setUploadError("Please select a school");
      return;
    }
    if (!selectedStandard) {
      setUploadError("Please select a grade/standard");
      return;
    }
    if (!selectedSubject) {
      setUploadError("Please select a subject");
      return;
    }
    if (!selectedFile) {
      setUploadError("Please select a file to upload");
      return;
    }

    setUploadLoading(true);
    setUploadError(null);
    setUploadSuccess(false);
    setUploadProgress(0);

    try {
      // Find school name from selected school ID
      const school = schools.find((s) => s.id === selectedSchool);
      if (!school) {
        throw new Error("Selected school not found");
      }

      await adminService.uploadDocument({
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
        },
      });

      setUploadSuccess(true);
      toast.success("Document uploaded and indexed successfully!");
      
      // Reset form
      setDocumentName("");
      setSelectedSchool("");
      setSelectedStandard("");
      setSelectedSubject("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Refresh documents list and close dialog immediately
      if (onRefresh) {
        onRefresh();
      }
      setIsUploadDocOpen(false);
    } catch (error: any) {
      console.error("Upload error:", error);
      
      let errorMessage = "Failed to upload document";
      
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMessage = "Upload timeout. The file may be too large or the server is taking too long to process. Please try with a smaller file or try again later.";
      } else if (error.response?.status === 502) {
        errorMessage = "Server error while processing the file. This may be due to a corrupted file or server overload. Please try again or contact support.";
      } else if (error.response?.status === 413) {
        errorMessage = "File is too large. Please try with a smaller file.";
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
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

