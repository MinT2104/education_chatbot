import { useEffect, useState } from "react";
import { paymentService } from "../../../payment/services/paymentService";
import { Plan, PlanFeature } from "../../../payment/types/plan";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  GripVertical,
  Loader2,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type PlanFormData = {
  code: string;
  name: string;
  description: string;
  priceGovernment: string;
  pricePrivate: string;
  currency: string;
  billingPeriod: string;
  badge: string;
  isActive: boolean;
  displayOrder: string;
  limitGovernment: string;
  limitPrivate: string;
  features: { text: string; enabled: boolean }[];
};

export const AdminPlanManagement = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansMocked, setPlansMocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const emptyForm: PlanFormData = {
    code: "",
    name: "",
    description: "",
    priceGovernment: "0",
    pricePrivate: "0",
    currency: "INR",
    billingPeriod: "month",
    badge: "",
    isActive: true,
    displayOrder: "0",
    limitGovernment: "",
    limitPrivate: "",
    features: [],
  };

  const [formData, setFormData] = useState<PlanFormData>(emptyForm);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const data = await paymentService.getAllPlans();
      
      // Service already returns Plan[], just sort
      const sorted = data.sort((a, b) => a.displayOrder - b.displayOrder);
      setPlans(sorted);
      setPlansMocked(sorted.some((p) => p.isMock));
    } catch (error: any) {
      toast.error("Failed to load plans: " + (error?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleOpenDialog = (plan?: Plan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        code: plan.code,
        name: plan.name,
        description: plan.description,
        priceGovernment: plan.priceGovernment.toString(),
        pricePrivate: plan.pricePrivate.toString(),
        currency: plan.currency,
        billingPeriod: plan.billingPeriod,
        badge: plan.badge || "",
        isActive: plan.isActive,
        displayOrder: plan.displayOrder.toString(),
        limitGovernment: plan.limitGovernment?.toString() || "",
        limitPrivate: plan.limitPrivate?.toString() || "",
        features: plan.features.map((f) => ({ text: f.text, enabled: f.enabled })),
      });
    } else {
      setEditingPlan(null);
      setFormData(emptyForm);
    }
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingPlan(null);
    setFormData(emptyForm);
  };

  const handleSavePlan = async () => {
    if (plansMocked) {
      toast.error("Plan API is not available (using mock data). Cannot save.");
      return;
    }
    if (!formData.name || !formData.code) {
      toast.error("Name and code are required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        code: formData.code,
        name: formData.name,
        description: formData.description,
        priceGovernment: parseFloat(formData.priceGovernment) || 0,
        pricePrivate: parseFloat(formData.pricePrivate) || 0,
        currency: formData.currency,
        billingPeriod: formData.billingPeriod,
        badge: formData.badge || undefined,
        isActive: formData.isActive,
        displayOrder: parseInt(formData.displayOrder) || 0,
        limitGovernment: formData.limitGovernment
          ? parseInt(formData.limitGovernment)
          : undefined,
        limitPrivate: formData.limitPrivate
          ? parseInt(formData.limitPrivate)
          : undefined,
        features: formData.features,
      };

      if (editingPlan) {
        await paymentService.updatePlan({ id: editingPlan.id, ...payload });
        toast.success("Plan updated successfully");
      } else {
        await paymentService.createPlan(payload);
        toast.success("Plan created successfully");
      }
      await loadPlans();
      handleCloseDialog();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to save plan"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (plansMocked) {
      toast.error("Plan API is not available (using mock data). Cannot delete.");
      return;
    }
    setLoading(true);
    try {
      await paymentService.deletePlan(planId);
      toast.success("Plan deleted successfully");
      await loadPlans();
      setDeleteConfirm(null);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete plan"
      );
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, { text: "", enabled: true }],
    }));
  };

  const updateFeature = (index: number, field: keyof PlanFeature, value: any) => {
    setFormData((prev) => {
      const newFeatures = [...prev.features];
      newFeatures[index] = { ...newFeatures[index], [field]: value };
      return { ...prev, features: newFeatures };
    });
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">Plan Management</CardTitle>
              <CardDescription className="text-xs sm:text-sm mt-1">
                Create and manage subscription plans
              </CardDescription>
              {plansMocked && (
                <p className="text-[11px] sm:text-xs text-red-600 mt-1">
                  Backend plans API unavailable; showing mock data only. Saves are disabled.
                </p>
              )}
            </div>
            <Button onClick={() => handleOpenDialog()} size="sm" disabled={plansMocked}>
              <Plus className="w-4 h-4 mr-2" />
              Add Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading && plans.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-8 text-text-subtle">
              No plans found. Create your first plan.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plans.map((plan) => {
                const currencySymbol = plan.currency === "USD" ? "$" : "₹";
                const enabledFeatures = plan.features.filter(
                  (f) => f.enabled !== false
                );

                return (
                  <div
                    key={plan.id}
                    className="rounded-xl border border-border p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-text">
                            {plan.name}
                          </h3>
                          {plan.badge && (
                            <span className="text-2xs px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-600">
                              {plan.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-text-subtle mt-1">
                          {plan.description}
                        </p>
                        <p className="text-[11px] text-text-subtle mt-1">
                          Code: <span className="font-medium">{plan.code}</span>{" "}
                          • Billing: {plan.billingPeriod || "month"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(plan)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirm(plan.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 mt-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm text-text-subtle">Gov:</span>
                        <span className="text-lg font-semibold text-text">
                          {currencySymbol}
                          {plan.priceGovernment}
                        </span>
                        <span className="text-xs text-text-subtle">
                          /{plan.billingPeriod}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm text-text-subtle">Private:</span>
                        <span className="text-lg font-semibold text-text">
                          {currencySymbol}
                          {plan.pricePrivate}
                        </span>
                        <span className="text-xs text-text-subtle">
                          /{plan.billingPeriod}
                        </span>
                      </div>
                      {(plan.limitGovernment || plan.limitPrivate) && (
                        <div className="text-xs text-text-subtle">
                          Limits: Gov {plan.limitGovernment ?? "—"}/day • Private{" "}
                          {plan.limitPrivate ?? "—"}/day
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-border space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-subtle">
                          Order: {plan.displayOrder}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            plan.isActive
                              ? "bg-green-500/10 text-green-600"
                              : "bg-gray-500/10 text-gray-600"
                          }`}
                        >
                          {plan.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="text-xs text-text-subtle">
                        Features ({enabledFeatures.length})
                      </div>
                      <ul className="space-y-1">
                        {(enabledFeatures.length ? enabledFeatures : plan.features).map(
                          (feature) => (
                            <li
                              key={feature.id}
                              className={`text-xs flex items-center gap-2 ${
                                feature.enabled === false
                                  ? "line-through text-text-subtle/70"
                                  : "text-text"
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 inline-block" />
                              {feature.text}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPlan ? "Edit Plan" : "Create New Plan"}
            </DialogTitle>
            <DialogDescription>
              {editingPlan
                ? "Update plan details and features"
                : "Add a new subscription plan"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Plan Code *
                </label>
                <Input
                  value={formData.code}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, code: e.target.value }))
                  }
                  placeholder="e.g., free, go, premium"
                  disabled={!!editingPlan}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Plan Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., Free, Go, Premium"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Plan description"
                rows={2}
              />
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Government Price (₹)
                </label>
                <Input
                  type="number"
                  value={formData.priceGovernment}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      priceGovernment: e.target.value,
                    }))
                  }
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Private Price (₹)
                </label>
                <Input
                  type="number"
                  value={formData.pricePrivate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      pricePrivate: e.target.value,
                    }))
                  }
                  placeholder="0"
                />
              </div>
            </div>

            {/* Limits (for free plans) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Gov Limit (msgs/day)
                </label>
                <Input
                  type="number"
                  value={formData.limitGovernment}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      limitGovernment: e.target.value,
                    }))
                  }
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Private Limit (msgs/day)
                </label>
                <Input
                  type="number"
                  value={formData.limitPrivate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      limitPrivate: e.target.value,
                    }))
                  }
                  placeholder="Optional"
                />
              </div>
            </div>

            {/* Other Settings */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Badge</label>
                <Input
                  value={formData.badge}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, badge: e.target.value }))
                  }
                  placeholder="e.g., NEW, POPULAR"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Display Order
                </label>
                <Input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      displayOrder: e.target.value,
                    }))
                  }
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Active</label>
                <div className="flex items-center h-10">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isActive: checked }))
                    }
                  />
                  <span className="ml-2 text-sm text-text-subtle">
                    {formData.isActive ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Features</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFeature}
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Feature
                </Button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {formData.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 rounded-lg border border-border"
                  >
                    <GripVertical className="w-4 h-4 text-text-subtle" />
                    <Input
                      value={feature.text}
                      onChange={(e) =>
                        updateFeature(index, "text", e.target.value)
                      }
                      placeholder="Feature description"
                      className="flex-1"
                    />
                    <Switch
                      checked={feature.enabled}
                      onCheckedChange={(checked) =>
                        updateFeature(index, "enabled", checked)
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(index)}
                      className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
                {formData.features.length === 0 && (
                  <div className="text-center py-4 text-sm text-text-subtle">
                    No features added yet
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSavePlan} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Plan
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm !== null}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Plan</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this plan? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDeletePlan(deleteConfirm)}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
