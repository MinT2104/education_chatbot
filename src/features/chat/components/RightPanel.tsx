import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WebResult {
  title: string;
  url: string;
  snippet: string;
  favicon?: string;
}

interface CodeResult {
  code: string;
  language: string;
  output?: string;
}

interface FileInfo {
  name: string;
  size: number;
  type: string;
  indexed: boolean;
}

interface RightPanelProps {
  show: boolean;
  onClose: () => void;
  webResults?: WebResult[];
  codeResults?: CodeResult[];
  files?: FileInfo[];
  activeTab?: "web" | "code" | "files" | "data";
}

const RightPanel = ({
  show,
  onClose,
  webResults = [],
  codeResults = [],
  files = [],
  activeTab = "web",
}: RightPanelProps) => {
  const [selectedTab, setSelectedTab] = useState(activeTab);

  if (!show) return null;

  return (
    <div className="w-80 border-l border-border bg-background flex flex-col h-full">
      {/* Header */}
      <div className="h-16 border-b border-border flex items-center justify-between px-4">
        <h2 className="font-semibold">Tools & Results</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs
          value={selectedTab}
          onValueChange={(v) => setSelectedTab(v as any)}
          className="h-full flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-4 rounded-none border-b">
            <TabsTrigger value="web">Web</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          {/* Web Results Tab */}
          <TabsContent value="web" className="flex-1 overflow-y-auto p-4 mt-0">
            {webResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                <svg
                  className="w-12 h-12 mb-3 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                <p className="text-sm">No web results yet</p>
                <p className="text-xs mt-1">
                  Enable web search to see results here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {webResults.map((result, idx) => (
                  <a
                    key={idx}
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      {result.favicon && (
                        <img
                          src={result.favicon}
                          alt=""
                          className="w-4 h-4 mt-0.5"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium line-clamp-2 mb-1">
                          {result.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {result.snippet}
                        </p>
                        <div className="text-xs text-primary mt-1 flex items-center gap-1">
                          <span className="truncate">{new URL(result.url).hostname}</span>
                          <svg
                            className="w-3 h-3 shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Code Results Tab */}
          <TabsContent value="code" className="flex-1 overflow-y-auto p-4 mt-0">
            {codeResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                <svg
                  className="w-12 h-12 mb-3 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
                <p className="text-sm">No code executed yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {codeResults.map((result, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="p-3 rounded-lg bg-muted/50 border border-border">
                      <div className="text-xs text-muted-foreground mb-2">
                        {result.language}
                      </div>
                      <pre className="text-xs overflow-x-auto">
                        <code>{result.code}</code>
                      </pre>
                    </div>
                    {result.output && (
                      <div className="p-3 rounded-lg bg-muted/30 border border-border">
                        <div className="text-xs text-muted-foreground mb-2">
                          Output
                        </div>
                        <pre className="text-xs overflow-x-auto text-green-600 dark:text-green-400">
                          <code>{result.output}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files" className="flex-1 overflow-y-auto p-4 mt-0">
            {files.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                <svg
                  className="w-12 h-12 mb-3 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm">No files attached</p>
              </div>
            ) : (
              <div className="space-y-2">
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-border flex items-center gap-3"
                  >
                    <svg
                      className="w-8 h-8 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {file.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                    {file.indexed && (
                      <div className="text-xs text-green-600 dark:text-green-400">
                        ✓ Indexed
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data" className="flex-1 overflow-y-auto p-4 mt-0">
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
              <svg
                className="w-12 h-12 mb-3 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-sm">No data tables yet</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RightPanel;

