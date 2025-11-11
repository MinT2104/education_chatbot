import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { adminService, StaticPageSummary } from "../../services/adminService";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const PAGE_ORDER = ["terms", "privacy", "cookies"];

const labelMap: Record<string, string> = {
  terms: "Terms of Service",
  privacy: "Privacy Policy",
  cookies: "Cookie Policy",
};

export const AdminStaticPages = () => {
  const [pages, setPages] = useState<StaticPageSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await adminService.getStaticPages();
      const sorted = (res.pages || []).sort((a, b) => {
        const ai = PAGE_ORDER.indexOf(a.slug);
        const bi = PAGE_ORDER.indexOf(b.slug);
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      });
      setPages(sorted);
    } catch (error: any) {
      console.error("Failed to load static pages", error);
      toast.error(
        error?.response?.data?.message || "Failed to load static pages"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateLocal = (id: string, field: keyof StaticPageSummary, value: string) => {
    setPages((prev) =>
      prev.map((page) => (page.id === id ? { ...page, [field]: value } : page))
    );
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "blockquote", "code-block"],
      [{ align: [] }],
      ["clean"],
    ],
  };

  const handleSave = async (page: StaticPageSummary) => {
    try {
      setSavingId(page.id);
      await adminService.updateStaticPage(page.id, {
        title: page.title,
        content: page.content,
      });
      toast.success("Page saved successfully");
      await load();
    } catch (error: any) {
      console.error("Failed to save page", error);
      toast.error(error?.response?.data?.message || "Failed to save page");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Policy Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Loading pages...</div>
        </CardContent>
      </Card>
    );
  }

  if (pages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Policy Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            No pages found. Please seed the database and try again.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Policy Pages</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={pages[0]?.slug} className="w-full">
          <TabsList className="flex flex-wrap gap-2 mb-4">
            {pages.map((page) => (
              <TabsTrigger key={page.id} value={page.slug}>
                {labelMap[page.slug] || page.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {pages.map((page) => (
            <TabsContent key={page.id} value={page.slug} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Title
                </label>
                <Input
                  value={page.title}
                  onChange={(e) => updateLocal(page.id, "title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Content
                </label>
                <ReactQuill
                  theme="snow"
                  modules={quillModules}
                  value={page.content}
                  onChange={(value) => updateLocal(page.id, "content", value)}
                  className="bg-background"
                />
              </div>
              <Button
                onClick={() => handleSave(page)}
                disabled={savingId === page.id}
              >
                {savingId === page.id ? "Saving..." : "Save Changes"}
              </Button>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};


