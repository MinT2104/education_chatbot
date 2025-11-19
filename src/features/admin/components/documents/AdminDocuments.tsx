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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
        setUploadError("Please upload a PDF file");
        return;
      }
      // Validate file size (50MB)
      if (file.size > 50 * 1024 * 1024) {
        setUploadError("File size must be less than 50MB");
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

      // Refresh documents list
      if (onRefresh) {
        setTimeout(() => {
          onRefresh();
          setIsUploadDocOpen(false);
        }, 1500);
      } else {
        setTimeout(() => {
          setIsUploadDocOpen(false);
        }, 1500);
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      const errorMessage = error.response?.data?.detail || error.message || "Failed to upload document";
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
                  Upload educational content that will be indexed for AI
                  responses
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
                    accept=".pdf"
                    onChange={handleFileSelect}
                    disabled={uploadLoading}
                    className="hidden"
                  />
                  <div
                    onClick={() => !uploadLoading && fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      uploadLoading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:border-primary cursor-pointer"
                    } ${selectedFile ? "border-primary bg-primary/5" : ""}`}
                  >
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    {selectedFile ? (
                      <div>
                        <p className="text-sm font-medium">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PDF files up to 50MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
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

