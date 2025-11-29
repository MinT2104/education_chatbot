import { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

type SpaceItem = {
  title: string;
  description: string;
  icon: string;
  content: string;
};

export const AdminSpaces = () => {
  const [spaces, setSpaces] = useState<SpaceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<
    Array<{ text: string; icon?: string }>
  >([]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAppSettings();
      const raw = res.settings?.spaces_config;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setSpaces(parsed);
      }
      const suggRaw = res.settings?.chat_quick_suggestions;
      if (suggRaw) {
        try {
          const parsedS = JSON.parse(suggRaw);
          if (Array.isArray(parsedS)) setSuggestions(parsedS);
        } catch {
          // ignore error
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addSpace = () => {
    setSpaces((s: SpaceItem[]) => [
      ...s,
      { title: "", description: "", icon: "✨", content: "" },
    ]);
  };
  const removeSpace = (idx: number) => {
    setSpaces((s: SpaceItem[]) => s.filter((_, i) => i !== idx));
  };
  const update = (idx: number, key: keyof SpaceItem, value: string) => {
    setSpaces((s: SpaceItem[]) =>
      s.map((item, i) => (i === idx ? { ...item, [key]: value } : item))
    );
  };
  const save = async () => {
    try {
      setLoading(true);
      const payload = {
        spaces_config: JSON.stringify(spaces),
        chat_quick_suggestions: JSON.stringify(suggestions),
      };
      await adminService.updateAppSettings(payload);
      toast.success("Spaces saved");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spaces & Quick Suggestions</CardTitle>
        <CardDescription>
          Manage quick-start spaces and the ChatPage quick suggestions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <Button onClick={addSpace} disabled={loading}>
            Add Space
          </Button>
          <Button onClick={save} disabled={loading}>
            Save
          </Button>
        </div>
        <div className="space-y-4">
          {spaces.length === 0 && (
            <div className="text-sm text-muted-foreground">
              No spaces yet. Click “Add Space”.
            </div>
          )}
          {spaces.map((s, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-border p-4 space-y-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={s.title}
                    onChange={(e: any) => update(idx, "title", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Icon (emoji)</Label>
                  <Input
                    value={s.icon}
                    onChange={(e: any) => update(idx, "icon", e.target.value)}
                    maxLength={2}
                  />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={s.description}
                  onChange={(e: any) => update(idx, "description", e.target.value)}
                />
              </div>
              <div>
                <Label>Prompt Content</Label>
                <textarea
                  className="w-full rounded-md border border-border bg-background p-2 text-sm min-h-[180px]"
                  rows={8}
                  value={s.content}
                  onChange={(e: any) => update(idx, "content", e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  variant="destructive"
                  onClick={() => removeSpace(idx)}
                  disabled={loading}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="pt-6">
          <div className="mb-3">
            <Label className="text-base">Chat Quick Suggestions</Label>
            <div className="text-sm text-muted-foreground">
              Shown under the composer on ChatPage when there are no messages.
            </div>
          </div>
          <div className="space-y-3">
            {suggestions.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
              >
                <div className="md:col-span-1">
                  <Label>Icon</Label>
                  <Input
                    value={item.icon || ""}
                    onChange={(e: any) => {
                      const next = suggestions.slice();
                      next[idx] = { ...next[idx], icon: e.target.value };
                      setSuggestions(next);
                    }}
                    placeholder="e.g., 💡"
                    maxLength={2}
                  />
                </div>
                <div className="md:col-span-10">
                  <Label>Text</Label>
                  <Input
                    value={item.text}
                    onChange={(e: any) => {
                      const next = suggestions.slice();
                      next[idx] = { ...next[idx], text: e.target.value };
                      setSuggestions(next);
                    }}
                    placeholder="Suggestion text"
                  />
                </div>
                <div className="md:col-span-1 flex md:justify-end">
                  <Button
                    variant="destructive"
                    onClick={() =>
                      setSuggestions((arr) => arr.filter((_, i) => i !== idx))
                    }
                    disabled={loading}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            <div>
              <Button
                variant="secondary"
                onClick={() =>
                  setSuggestions((arr) => [...arr, { text: "", icon: "💡" }])
                }
                disabled={loading}
              >
                Add Suggestion
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
