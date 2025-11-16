import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Search, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { adminService, Subject } from "../../services/adminService";
import { toast } from "react-toastify";
import { Switch } from "@/components/ui/switch";

export const AdminSubjects = () => {
  const [subjectSearch, setSubjectSearch] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [isEditSubjectOpen, setIsEditSubjectOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [processing, setProcessing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    gradeLevel: "",
    isActive: true,
  });

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllSubjectsAdmin({
        page: 1,
        limit: 1000,
      });
      setSubjects(Array.isArray(response.rows) ? response.rows : []);
    } catch (error: any) {
      console.error("Failed to load subjects:", error);
      toast.error(error.response?.data?.message || "Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  const filteredSubjects = useMemo(
    () =>
      subjects.filter((subject) =>
        [
          subject.name,
          subject.code || "",
          subject.description || "",
          subject.gradeLevel || "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(subjectSearch.toLowerCase())
      ),
    [subjects, subjectSearch]
  );

  const handleCreateSubject = async () => {
    if (!formData.name.trim()) {
      toast.error("Subject name is required");
      return;
    }

    try {
      setProcessing(true);
      await adminService.createSubject({
        name: formData.name.trim(),
        code: formData.code.trim() || null,
        description: formData.description.trim() || null,
        gradeLevel: formData.gradeLevel.trim() || null,
        isActive: formData.isActive,
      });
      toast.success("Subject created successfully");
      setIsAddSubjectOpen(false);
      resetForm();
      await loadSubjects();
    } catch (error: any) {
      console.error("Failed to create subject:", error);
      toast.error(
        error.response?.data?.message || "Failed to create subject"
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleEditSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code || "",
      description: subject.description || "",
      gradeLevel: subject.gradeLevel || "",
      isActive: subject.isActive,
    });
    setIsEditSubjectOpen(true);
  };

  const handleUpdateSubject = async () => {
    if (!selectedSubject || !formData.name.trim()) {
      toast.error("Subject name is required");
      return;
    }

    try {
      setProcessing(true);
      await adminService.updateSubject(selectedSubject.id, {
        name: formData.name.trim(),
        code: formData.code.trim() || null,
        description: formData.description.trim() || null,
        gradeLevel: formData.gradeLevel.trim() || null,
        isActive: formData.isActive,
      });
      toast.success("Subject updated successfully");
      setIsEditSubjectOpen(false);
      setSelectedSubject(null);
      resetForm();
      await loadSubjects();
    } catch (error: any) {
      console.error("Failed to update subject:", error);
      toast.error(
        error.response?.data?.message || "Failed to update subject"
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteClick = (subject: Subject) => {
    setSubjectToDelete(subject);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!subjectToDelete) return;

    try {
      setProcessing(true);
      await adminService.deleteSubject(subjectToDelete.id);
      toast.success("Subject deleted successfully");
      setDeleteDialogOpen(false);
      setSubjectToDelete(null);
      await loadSubjects();
    } catch (error: any) {
      console.error("Failed to delete subject:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete subject"
      );
    } finally {
      setProcessing(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      gradeLevel: "",
      isActive: true,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subject Management</CardTitle>
          <CardDescription>Manage subjects and their information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <CardTitle className="text-lg sm:text-xl">
                Subject Management
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Manage subjects and their information ({subjects.length} subjects)
              </CardDescription>
            </div>
            <Dialog
              open={isAddSubjectOpen}
              onOpenChange={(open) => {
                setIsAddSubjectOpen(open);
                if (!open) {
                  resetForm();
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm">
                  <Plus className="w-4 h-4" />
                  Add Subject
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Subject</DialogTitle>
                  <DialogDescription>
                    Create a new subject in the system
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject-name">Subject Name *</Label>
                    <Input
                      id="subject-name"
                      placeholder="Enter subject name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      disabled={processing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject-code">Subject Code</Label>
                    <Input
                      id="subject-code"
                      placeholder="Enter subject code (e.g., MATH)"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value })
                      }
                      disabled={processing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject-description">Description</Label>
                    <Textarea
                      id="subject-description"
                      placeholder="Enter subject description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      disabled={processing}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject-grade-level">Grade Level</Label>
                    <Input
                      id="subject-grade-level"
                      placeholder="Enter grade level (e.g., Elementary, High School)"
                      value={formData.gradeLevel}
                      onChange={(e) =>
                        setFormData({ ...formData, gradeLevel: e.target.value })
                      }
                      disabled={processing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="subject-active">Active Status</Label>
                    <Switch
                      id="subject-active"
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isActive: checked })
                      }
                      disabled={processing}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddSubjectOpen(false);
                      resetForm();
                    }}
                    disabled={processing}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateSubject} disabled={processing}>
                    {processing ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating...
                      </span>
                    ) : (
                      "Create Subject"
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
                placeholder="Search subjects..."
                value={subjectSearch}
                onChange={(e) => setSubjectSearch(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
          </div>
          <div className="rounded-md border overflow-x-auto -mx-1 sm:mx-0">
            <div className="min-w-[800px] sm:min-w-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Subject Name</TableHead>
                    <TableHead className="min-w-[100px] hidden md:table-cell">
                      Code
                    </TableHead>
                    <TableHead className="min-w-[150px] hidden lg:table-cell">
                      Description
                    </TableHead>
                    <TableHead className="min-w-[100px] hidden md:table-cell">
                      Grade Level
                    </TableHead>
                    <TableHead className="min-w-[80px]">Status</TableHead>
                    <TableHead className="min-w-[100px] hidden lg:table-cell">
                      Created
                    </TableHead>
                    <TableHead className="text-right min-w-[100px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubjects.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No subjects found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSubjects.map((subject) => (
                      <TableRow key={subject.id}>
                        <TableCell className="font-medium text-xs sm:text-sm">
                          <span className="truncate block">{subject.name}</span>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                          {subject.code || "—"}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                          <span className="truncate block">
                            {subject.description || "—"}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                          {subject.gradeLevel || "—"}
                        </TableCell>
                        <TableCell>
                          {subject.isActive ? (
                            <Badge variant="default" className="bg-green-500 text-xs">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                          {subject.createdAt
                            ? formatDate(subject.createdAt)
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1 sm:gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditSubject(subject)}
                              disabled={processing}
                              className="h-8 w-8"
                            >
                              <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(subject)}
                              disabled={processing}
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
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={isEditSubjectOpen}
        onOpenChange={(open) => {
          setIsEditSubjectOpen(open);
          if (!open) {
            setSelectedSubject(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
            <DialogDescription>Update subject information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-subject-name">Subject Name *</Label>
              <Input
                id="edit-subject-name"
                placeholder="Enter subject name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={processing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-subject-code">Subject Code</Label>
              <Input
                id="edit-subject-code"
                placeholder="Enter subject code (e.g., MATH)"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                disabled={processing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-subject-description">Description</Label>
              <Textarea
                id="edit-subject-description"
                placeholder="Enter subject description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                disabled={processing}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-subject-grade-level">Grade Level</Label>
              <Input
                id="edit-subject-grade-level"
                placeholder="Enter grade level (e.g., Elementary, High School)"
                value={formData.gradeLevel}
                onChange={(e) =>
                  setFormData({ ...formData, gradeLevel: e.target.value })
                }
                disabled={processing}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-subject-active">Active Status</Label>
              <Switch
                id="edit-subject-active"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
                disabled={processing}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditSubjectOpen(false);
                setSelectedSubject(null);
                resetForm();
              }}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateSubject} disabled={processing}>
              {processing ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </span>
              ) : (
                "Update Subject"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subject</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{subjectToDelete?.name}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteDialogOpen(false);
                setSubjectToDelete(null);
              }}
              disabled={processing}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={processing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {processing ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </span>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

