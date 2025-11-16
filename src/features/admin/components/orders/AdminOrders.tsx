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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Loader2 } from "lucide-react";
import { adminService, AdminSubscription } from "../../services/adminService";
import { toast } from "react-toastify";

export const AdminOrders = () => {
  const [orderSearch, setOrderSearch] = useState("");
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllSubscriptions();
      setSubscriptions(response.subscriptions || []);
    } catch (error: any) {
      console.error("Failed to load subscriptions:", error);
      toast.error("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscriptions = useMemo(
    () =>
      subscriptions.filter((sub) =>
        [sub.id, sub.userName, sub.userEmail, sub.plan, sub.status]
          .join(" ")
          .toLowerCase()
          .includes(orderSearch.toLowerCase())
      ),
    [subscriptions, orderSearch]
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Orders & Subscriptions</CardTitle>
          <CardDescription>
            Refund, cancel, and audit billing activity
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
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg sm:text-xl">Orders & Subscriptions</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Refund, cancel, and audit billing activity
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search orders, users, plans..."
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto -mx-1 sm:mx-0">
          <div className="min-w-[800px] sm:min-w-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px]">Subscription ID</TableHead>
                  <TableHead className="min-w-[150px]">User</TableHead>
                  <TableHead className="min-w-[80px]">Plan</TableHead>
                  <TableHead className="min-w-[100px] hidden md:table-cell">Amount</TableHead>
                  <TableHead className="min-w-[80px]">Status</TableHead>
                  <TableHead className="min-w-[100px] hidden lg:table-cell">Next Billing</TableHead>
                  <TableHead className="min-w-[100px] hidden lg:table-cell">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No subscriptions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubscriptions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium text-xs sm:text-sm">
                        <span className="font-mono">{sub.id.substring(0, 8)}...</span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5 sm:space-y-1">
                          <div className="font-medium text-xs sm:text-sm truncate">{sub.userName}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {sub.userEmail}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                        {sub.plan === "go" ? "₹399" : "$0"} / month
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            sub.status === "active"
                              ? "default"
                              : sub.status === "pending"
                              ? "secondary"
                              : sub.status === "cancelled" ||
                                sub.status === "expired"
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {sub.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                        {sub.status === "active"
                          ? formatDate(sub.nextBillingDate)
                          : "—"}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                        {formatDate(sub.createdAt)}
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
  );
};
