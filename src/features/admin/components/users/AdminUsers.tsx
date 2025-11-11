import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  RefreshCw,
} from "lucide-react";
import { adminService, AdminUser } from "../../services/adminService";
import { UserDetailPanel } from "./UserDetailPanel";
import { toast } from "react-toastify";

type SortField = "name" | "email" | "createdAt" | "lastActive" | "plan";
type SortDirection = "asc" | "desc";

export const AdminUsers = () => {
  const [userSearch, setUserSearch] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Sorting
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const usersData = await adminService.getAllUsers();

      // Ensure usersData is an array
      if (!Array.isArray(usersData)) {
        console.error("Users data is not an array:", usersData);
        toast.error("Invalid data format received");
        return;
      }

      // Fetch subscriptions for each user (batch to avoid too many requests)
      const usersWithSubscriptions = await Promise.all(
        usersData.map(async (user) => {
          try {
            const subResponse = await adminService.getSubscriptionByUserId(
              user.id
            );
            return {
              ...user,
              subscription: subResponse.subscription,
            };
          } catch (error) {
            console.error(
              `Failed to load subscription for user ${user.id}:`,
              error
            );
            return {
              ...user,
              subscription: null,
            };
          }
        })
      );

      setUsers(usersWithSubscriptions);
      if (usersWithSubscriptions.length > 0 && !selectedUser) {
        setSelectedUser(usersWithSubscriptions[0]);
      }
    } catch (error: any) {
      console.error("Failed to load users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter((user) => {
      // Search filter
      const matchesSearch = [
        user.name,
        user.email,
        user.role,
        user.location || "",
        user.plan,
        user.subscription?.status || "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(userSearch.toLowerCase());

      // Plan filter
      const matchesPlan = planFilter === "all" || user.plan === planFilter;

      // Status filter
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;

      return matchesSearch && matchesPlan && matchesStatus;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "name":
          aValue = a.name?.toLowerCase() || "";
          bValue = b.name?.toLowerCase() || "";
          break;
        case "email":
          aValue = a.email?.toLowerCase() || "";
          bValue = b.email?.toLowerCase() || "";
          break;
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "lastActive":
          aValue = new Date(a.lastActive || 0).getTime();
          bValue = new Date(b.lastActive || 0).getTime();
          break;
        case "plan":
          aValue = a.plan?.toLowerCase() || "";
          bValue = b.plan?.toLowerCase() || "";
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [users, userSearch, planFilter, statusFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredAndSortedUsers.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [userSearch, planFilter, statusFilter]);

  const SortButton = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 gap-1"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown className="h-3 w-3" />
      {sortField === field && (
        <span className="text-xs">{sortDirection === "asc" ? "↑" : "↓"}</span>
      )}
    </Button>
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              View, audit, and manage every account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <Card className="xl:col-span-2">
        <CardHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View, audit, and manage every account (
                  {filteredAndSortedUsers.length} users)
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadUsers(true)}
                disabled={refreshing}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by name, email, plan or location..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-full md:w-[140px]">
                  <SelectValue placeholder="Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="go">Go</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Bulk/Admin actions for selected user */}
          {selectedUser && (
            <div className="flex items-center justify-end gap-3 mb-4">
              <Button
                variant="destructive"
                size="sm"
                disabled={
                  !selectedUser.subscription ||
                  selectedUser.subscription.status !== "active"
                }
                onClick={async () => {
                  try {
                    await adminService.cancelUserSubscription(selectedUser.id);
                    toast.success("Subscription cancelled");
                    loadUsers(true);
                  } catch (e: any) {
                    toast.error(e?.response?.data?.message || "Cancel failed");
                  }
                }}
              >
                Cancel Subscription
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    const res = await adminService.refundUserSubscription(
                      selectedUser.id
                    );
                    toast.info(res?.message || "Refund requested");
                  } catch (e: any) {
                    toast.error(e?.response?.data?.message || "Refund failed");
                  }
                }}
              >
                Refund Last Payment
              </Button>
            </div>
          )}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <SortButton field="name">Name</SortButton>
                  </TableHead>
                  <TableHead>
                    <SortButton field="email">Email</SortButton>
                  </TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>
                    <SortButton field="plan">Plan</SortButton>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <SortButton field="lastActive">Last Active</SortButton>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedUser?.id === user.id ? "bg-muted/70" : ""
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold">
                            {user.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                          {user.name || "—"}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "admin"
                              ? "destructive"
                              : user.role === "teacher"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {user.location || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {user.plan.charAt(0).toUpperCase() +
                            user.plan.slice(1)}
                        </Badge>
                        {user.subscription && (
                          <Badge
                            variant="outline"
                            className="ml-1 text-xs"
                            title={`Subscription: ${user.subscription.status}`}
                          >
                            {user.subscription.status === "active" ? "✓" : ""}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.status === "active" ? "default" : "secondary"
                          }
                          className={
                            user.status === "active" ? "bg-green-500" : ""
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {user.lastActive
                          ? new Date(user.lastActive).toLocaleDateString()
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredAndSortedUsers.length)} of{" "}
                {filteredAndSortedUsers.length} users
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <UserDetailPanel user={selectedUser} />
    </div>
  );
};
