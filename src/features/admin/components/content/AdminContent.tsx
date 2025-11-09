import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, RefreshCcw } from "lucide-react";
import { HomePageContent } from "../../types";
import { mockHomeContent } from "../../data/mockData";

interface AdminContentProps {
  homeContent: HomePageContent;
  onContentChange: (content: HomePageContent) => void;
}

export const AdminContent = ({
  homeContent,
  onContentChange,
}: AdminContentProps) => {
  const [announcementsInput, setAnnouncementsInput] = useState(
    homeContent.announcements.join("\n")
  );

  const updateHeroContent = (
    field: keyof HomePageContent["hero"],
    value: string
  ) => {
    onContentChange({
      ...homeContent,
      hero: {
        ...homeContent.hero,
        [field]: value,
      },
    });
  };

  const updatePlaceholder = (
    field: keyof HomePageContent["placeholders"],
    value: string
  ) => {
    onContentChange({
      ...homeContent,
      placeholders: {
        ...homeContent.placeholders,
        [field]: value,
      },
    });
  };

  const updateHighlight = (
    id: string,
    field: "title" | "description",
    value: string
  ) => {
    onContentChange({
      ...homeContent,
      highlights: homeContent.highlights.map((highlight) =>
        highlight.id === id
          ? {
              ...highlight,
              [field]: value,
            }
          : highlight
      ),
    });
  };

  const handleAnnouncementsChange = (value: string) => {
    setAnnouncementsInput(value);
    onContentChange({
      ...homeContent,
      announcements: value
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    });
  };

  const resetHomeContent = () => {
    onContentChange(mockHomeContent);
    setAnnouncementsInput(mockHomeContent.announcements.join("\n"));
  };

  const handleSaveContent = () => {
    console.log("[Admin] Home content saved", homeContent);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>
            Fine-tune the messaging shown on the home page hero
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hero-title">Title</Label>
            <Input
              id="hero-title"
              value={homeContent.hero.title}
              onChange={(e) => updateHeroContent("title", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-subtitle">Subtitle</Label>
            <Textarea
              id="hero-subtitle"
              value={homeContent.hero.subtitle}
              onChange={(e) => updateHeroContent("subtitle", e.target.value)}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hero-primary-cta">Primary CTA</Label>
              <Input
                id="hero-primary-cta"
                value={homeContent.hero.primaryCta}
                onChange={(e) => updateHeroContent("primaryCta", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-secondary-cta">Secondary CTA</Label>
              <Input
                id="hero-secondary-cta"
                value={homeContent.hero.secondaryCta}
                onChange={(e) =>
                  updateHeroContent("secondaryCta", e.target.value)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Placeholders & Prompts</CardTitle>
          <CardDescription>
            Keep UI hints up-to-date across experiences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="placeholder-chat">Chat input placeholder</Label>
            <Input
              id="placeholder-chat"
              value={homeContent.placeholders.chatInput}
              onChange={(e) => updatePlaceholder("chatInput", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="placeholder-signup">Signup input placeholder</Label>
            <Input
              id="placeholder-signup"
              value={homeContent.placeholders.signupEmail}
              onChange={(e) =>
                updatePlaceholder("signupEmail", e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="placeholder-search">Search bar placeholder</Label>
            <Input
              id="placeholder-search"
              value={homeContent.placeholders.searchBar}
              onChange={(e) => updatePlaceholder("searchBar", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Feature Highlights</CardTitle>
          <CardDescription>
            Update the cards displayed under the hero section
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {homeContent.highlights.map((highlight) => (
            <div
              key={highlight.id}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-lg p-4"
            >
              <div className="space-y-2">
                <Label htmlFor={`${highlight.id}-title`}>Title</Label>
                <Input
                  id={`${highlight.id}-title`}
                  value={highlight.title}
                  onChange={(e) =>
                    updateHighlight(highlight.id, "title", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor={`${highlight.id}-description`}>
                  Description
                </Label>
                <Textarea
                  id={`${highlight.id}-description`}
                  value={highlight.description}
                  onChange={(e) =>
                    updateHighlight(highlight.id, "description", e.target.value)
                  }
                  rows={3}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
          <CardDescription>
            Surface timely updates on the dashboard banner
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="announcements">
              Announcements (one per line)
            </Label>
            <Textarea
              id="announcements"
              value={announcementsInput}
              onChange={(e) => handleAnnouncementsChange(e.target.value)}
              rows={4}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              className="flex items-center gap-2"
              onClick={handleSaveContent}
            >
              <Upload className="w-4 h-4" />
              Save content changes
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-2"
              onClick={resetHomeContent}
            >
              <RefreshCcw className="w-4 h-4" />
              Reset to defaults
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

