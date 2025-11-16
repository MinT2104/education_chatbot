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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { adminService, School } from "../../services/adminService";
import { toast } from "react-toastify";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const AdminSchools = () => {
  const [schoolSearch, setSchoolSearch] = useState("");
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddSchoolOpen, setIsAddSchoolOpen] = useState(false);
  const [isEditSchoolOpen, setIsEditSchoolOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [processing, setProcessing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    country: "",
    state: "",
    city: "",
    schoolBoard: "",
    languages: [] as string[],
    category: "government",
  });

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      setLoading(true);
      const schoolsData = await adminService.getAllSchools();
      setSchools(Array.isArray(schoolsData) ? schoolsData : []);
    } catch (error: any) {
      console.error("Failed to load schools:", error);
      toast.error("Failed to load schools");
    } finally {
      setLoading(false);
    }
  };

  const filteredSchools = useMemo(
    () =>
      schools.filter((school) =>
        [school.name, school.country || "", school.address || ""]
          .join(" ")
          .toLowerCase()
          .includes(schoolSearch.toLowerCase())
      ),
    [schools, schoolSearch]
  );

  const handleCreateSchool = async () => {
    if (!formData.name.trim()) {
      toast.error("School name is required");
      return;
    }

    try {
      setProcessing(true);
      await adminService.createSchool({
        name: formData.name.trim(),
        address: formData.address.trim() || undefined,
        country: formData.country.trim() || undefined,
        state: formData.state.trim() || undefined,
        city: formData.city.trim() || undefined,
        schoolBoard: formData.schoolBoard.trim() || undefined,
        languages: formData.languages,
        category: formData.category as any,
      });
      toast.success("School created successfully");
      setIsAddSchoolOpen(false);
      setFormData({ name: "", address: "", country: "", state: "", city: "", schoolBoard: "", languages: [], category: "government" });
      await loadSchools();
    } catch (error: any) {
      console.error("Failed to create school:", error);
      toast.error(error.response?.data?.message || "Failed to create school");
    } finally {
      setProcessing(false);
    }
  };

  const handleEditSchool = (school: School) => {
    setSelectedSchool(school);
    setFormData({
      name: school.name,
      address: school.address || "",
      country: school.country || "",
      state: (school as any).state || "",
      city: (school as any).city || "",
      schoolBoard: (school as any).schoolBoard || "",
      languages: (school as any).languages || [],
      category: (school as any).category || "government",
    });
    setIsEditSchoolOpen(true);
  };

  const handleUpdateSchool = async () => {
    if (!selectedSchool || !formData.name.trim()) {
      toast.error("School name is required");
      return;
    }

    try {
      setProcessing(true);
      await adminService.updateSchool(selectedSchool.id, {
        name: formData.name.trim(),
        address: formData.address.trim() || undefined,
        country: formData.country.trim() || undefined,
        state: formData.state.trim() || undefined,
        city: formData.city.trim() || undefined,
        schoolBoard: formData.schoolBoard.trim() || undefined,
        languages: formData.languages,
        category: formData.category as any,
      });
      toast.success("School updated successfully");
      setIsEditSchoolOpen(false);
      setSelectedSchool(null);
      setFormData({ name: "", address: "", country: "", state: "", city: "", schoolBoard: "", languages: [], category: "government" });
      await loadSchools();
    } catch (error: any) {
      console.error("Failed to update school:", error);
      toast.error(error.response?.data?.message || "Failed to update school");
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteSchool = async (school: School) => {
    if (
      !confirm(
        `Are you sure you want to delete "${school.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setProcessing(true);
      await adminService.deleteSchool(school.id);
      toast.success("School deleted successfully");
      await loadSchools();
    } catch (error: any) {
      console.error("Failed to delete school:", error);
      toast.error(error.response?.data?.message || "Failed to delete school");
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>School Management</CardTitle>
          <CardDescription>
            Manage schools and their information
          </CardDescription>
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
              <CardTitle className="text-lg sm:text-xl">School Management</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Manage schools and their information ({schools.length} schools)
              </CardDescription>
            </div>
            <Dialog
              open={isAddSchoolOpen}
              onOpenChange={(open) => {
                setIsAddSchoolOpen(open);
                if (!open) {
                  setFormData({ name: "", address: "", country: "", state: "", city: "", schoolBoard: "", languages: [], category: "government" });
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm">
                  <Plus className="w-4 h-4" />
                  Add School
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New School</DialogTitle>
                  <DialogDescription>
                    Create a new school in the system
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="school-name">School Name *</Label>
                    <Input
                      id="school-name"
                      placeholder="Enter school name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school-address">Address</Label>
                    <Input
                      id="school-address"
                      placeholder="Enter address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school-country">Country</Label>
                    <Input
                      id="school-country"
                      placeholder="Enter country"
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="school-state">State</Label>
                      <Input
                        id="school-state"
                        placeholder="Enter state"
                        value={formData.state}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="school-city">City</Label>
                      <Input
                        id="school-city"
                        placeholder="Enter city"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school-board">School Board</Label>
                    <Input
                      id="school-board"
                      placeholder="Enter school board"
                      value={formData.schoolBoard}
                      onChange={(e) =>
                        setFormData({ ...formData, schoolBoard: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Languages</Label>
                    <div className="flex flex-wrap gap-3 text-sm">
                      {["english", "hindi", "gujarati"].map((lang) => {
                        const checked = formData.languages.includes(lang);
                        return (
                          <label key={lang} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="h-4 w-4"
                              checked={checked}
                              onChange={(e) => {
                                const next = new Set(formData.languages);
                                if (e.target.checked) next.add(lang);
                                else next.delete(lang);
                                setFormData({ ...formData, languages: Array.from(next) });
                              }}
                            />
                            <span className="capitalize">{lang}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="school-category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) =>
                      setFormData({ ...formData, category: v as any })
                    }
                  >
                    <SelectTrigger id="school-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddSchoolOpen(false);
                      setFormData({ name: "", address: "", country: "", state: "", city: "", schoolBoard: "", languages: [], category: "government" });
                    }}
                    disabled={processing}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateSchool} disabled={processing}>
                    {processing ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating...
                      </span>
                    ) : (
                      "Create School"
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
                placeholder="Search schools..."
                value={schoolSearch}
                onChange={(e) => setSchoolSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="rounded-md border overflow-x-auto -mx-1 sm:mx-0">
            <div className="min-w-[800px] sm:min-w-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">School Name</TableHead>
                    <TableHead className="min-w-[150px] hidden md:table-cell">Location</TableHead>
                    <TableHead className="min-w-[100px] hidden lg:table-cell">Languages</TableHead>
                    <TableHead className="min-w-[80px]">Students</TableHead>
                    <TableHead className="min-w-[80px] hidden md:table-cell">Teachers</TableHead>
                    <TableHead className="min-w-[100px] hidden lg:table-cell">Created</TableHead>
                    <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchools.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No schools found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSchools.map((school) => (
                      <TableRow key={school.id}>
                        <TableCell className="font-medium text-xs sm:text-sm">
                          <span className="truncate block">{school.name}</span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="text-xs sm:text-sm">
                            <div className="truncate">
                              {[school.country, (school as any).state, (school as any).city]
                                .filter(Boolean)
                                .join(", ") || "—"}
                            </div>
                            <div className="text-muted-foreground text-xs truncate">
                              {school.address || "—"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs hidden lg:table-cell">
                          {Array.isArray((school as any).languages) && (school as any).languages.length > 0
                            ? (school as any).languages.map((l: string) => l.charAt(0).toUpperCase() + l.slice(1)).join(", ")
                            : "—"}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">{school.totalStudents || 0}</TableCell>
                        <TableCell className="text-xs sm:text-sm hidden md:table-cell">{school.totalTeachers || 0}</TableCell>
                        <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                          {school.createdAt ? formatDate(school.createdAt) : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1 sm:gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditSchool(school)}
                              disabled={processing}
                              className="h-8 w-8"
                            >
                              <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteSchool(school)}
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
        open={isEditSchoolOpen}
        onOpenChange={(open) => {
          setIsEditSchoolOpen(open);
          if (!open) {
            setSelectedSchool(null);
            setFormData({ name: "", address: "", country: "", state: "", city: "", schoolBoard: "", languages: [], category: "government" });
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit School</DialogTitle>
            <DialogDescription>Update school information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-school-name">School Name *</Label>
              <Input
                id="edit-school-name"
                placeholder="Enter school name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-school-address">Address</Label>
              <Input
                id="edit-school-address"
                placeholder="Enter address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-school-country">Country</Label>
              <Input
                id="edit-school-country"
                placeholder="Enter country"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-school-state">State</Label>
                <Input
                  id="edit-school-state"
                  placeholder="Enter state"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-school-city">City</Label>
                <Input
                  id="edit-school-city"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-school-board">School Board</Label>
              <Input
                id="edit-school-board"
                placeholder="Enter school board"
                value={formData.schoolBoard}
                onChange={(e) =>
                  setFormData({ ...formData, schoolBoard: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Languages</Label>
              <div className="flex flex-wrap gap-3 text-sm">
                {["english", "hindi", "gujarati"].map((lang) => {
                  const checked = formData.languages.includes(lang);
                  return (
                    <label key={lang} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={checked}
                        onChange={(e) => {
                          const next = new Set(formData.languages);
                          if (e.target.checked) next.add(lang);
                          else next.delete(lang);
                          setFormData({ ...formData, languages: Array.from(next) });
                        }}
                      />
                      <span className="capitalize">{lang}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-school-category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(v) =>
                  setFormData({ ...formData, category: v as any })
                }
              >
                <SelectTrigger id="edit-school-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditSchoolOpen(false);
                setSelectedSchool(null);
                setFormData({ name: "", address: "", country: "", state: "", city: "", schoolBoard: "", languages: [], category: "government" });
              }}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateSchool} disabled={processing}>
              {processing ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </span>
              ) : (
                "Update School"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
