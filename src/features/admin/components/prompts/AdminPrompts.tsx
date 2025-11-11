import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { adminService, RolePrompt } from "../../services/adminService";

const DEFAULT_PROMPTS: RolePrompt[] = [
  {
    role: "student",
    content:
      "You are a helpful and positive educational assistant for students. Provide clear, kind, and encouraging responses using the provided source sentences.",
  },
  {
    role: "teacher",
    content:
      "You are an expert educational assistant helping teachers. Respond professionally and accurately based on the provided source sentences.",
  },
];

export const AdminPrompts = () => {
  const [prompts, setPrompts] = useState<RolePrompt[]>(DEFAULT_PROMPTS);
  const [loading, setLoading] = useState<boolean>(false);

  const loadPrompts = async () => {
    setLoading(true);
    try {
      const res = await adminService.getRolePrompts();
      if (Array.isArray(res?.prompts)) {
        const parsed = res.prompts
          .filter(
            (item): item is RolePrompt =>
              item &&
              typeof item.role === "string" &&
              typeof item.content === "string"
          )
          .map((item) => ({
            ...item,
            role: item.role === "teacher" ? "teacher" : "student",
          }));
        if (parsed.length > 0) {
          setPrompts(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to load prompts:", error);
      toast.error("Failed to load prompts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrompts();
  }, []);

  const updatePrompt = (idx: number, value: Partial<RolePrompt>) => {
    setPrompts((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, ...value } : item))
    );
  };

  const addPrompt = () => {
    setPrompts((prev) => [...prev, { role: "student", content: "" }]);
  };

  const removePrompt = (idx: number) => {
    setPrompts((prev) => prev.filter((_, i) => i !== idx));
  };

  const savePrompts = async () => {
    try {
      setLoading(true);
      const res = await adminService.updateRolePrompts(prompts);
      if (Array.isArray(res?.prompts)) {
        setPrompts(
          res.prompts.map((item) => ({
            ...item,
            role: item.role === "teacher" ? "teacher" : "student",
          }))
        );
      }
      toast.success("Prompts saved");
    } catch (error: any) {
      console.error("Failed to save prompts:", error);
      toast.error(error?.response?.data?.message || "Failed to save prompts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Prompts</CardTitle>
        <CardDescription>
          Manage the system prompts used for student and teacher chat
          experiences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button onClick={addPrompt} disabled={loading}>
            Add Prompt
          </Button>
          <Button onClick={savePrompts} disabled={loading}>
            Save Prompts
          </Button>
        </div>

        <div className="space-y-4">
          {prompts.length === 0 && (
            <div className="text-sm text-muted-foreground">
              No prompts defined. Click “Add Prompt” to create one.
            </div>
          )}

          {prompts.map((prompt, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-border bg-card/60 p-4 space-y-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="md:col-span-2">
                  <Label>Role</Label>
                  <Select
                    value={prompt.role}
                    onValueChange={(value) =>
                      updatePrompt(idx, { role: value as RolePrompt["role"] })
                    }
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-4">
                  <Label>Prompt Content</Label>
                  <textarea
                    className="w-full rounded-md border border-border bg-background p-2 text-sm min-h-[220px]"
                    rows={10}
                    value={prompt.content}
                    onChange={(e) =>
                      updatePrompt(idx, { content: e.target.value })
                    }
                    placeholder="Enter system prompt instructions..."
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center gap-4">
                <div className="text-xs text-muted-foreground">
                  Keep instructions concise and focused. These prompts condition
                  the assistant before generating responses.
                </div>
                <Button
                  variant="destructive"
                  onClick={() => removePrompt(idx)}
                  disabled={loading}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
