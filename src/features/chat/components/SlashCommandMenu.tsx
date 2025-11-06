import { useEffect, useState, useCallback } from "react";

interface SlashCommand {
  command: string;
  description: string;
  icon: string;
}

interface SlashCommandMenuProps {
  show: boolean;
  onSelect: (command: string) => void;
  onClose: () => void;
  position?: { x: number; y: number };
}

const SlashCommandMenu = ({
  show,
  onSelect,
  onClose,
  position,
}: SlashCommandMenuProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: SlashCommand[] = [
    { command: "/summarize", description: "Summarize the conversation", icon: "📝" },
    { command: "/translate", description: "Translate text", icon: "🌐" },
    { command: "/explain", description: "Explain in detail", icon: "💡" },
    { command: "/continue", description: "Continue the response", icon: "➡️" },
    { command: "/simplify", description: "Simplify the explanation", icon: "✨" },
    { command: "/code", description: "Generate code", icon: "💻" },
    { command: "/improve", description: "Improve the text", icon: "✏️" },
    { command: "/examples", description: "Show examples", icon: "📚" },
  ];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!show) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < commands.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : commands.length - 1));
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        onSelect(commands[selectedIndex].command);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    },
    [show, commands, selectedIndex, onSelect, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (show) {
      setSelectedIndex(0);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="absolute bottom-full left-0 mb-2 w-full max-w-sm bg-popover border border-border rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-2 z-50"
      style={position ? { left: position.x, bottom: position.y } : {}}
    >
      <div className="p-2 max-h-[300px] overflow-y-auto">
        {commands.map((cmd, index) => (
          <button
            key={cmd.command}
            onClick={() => onSelect(cmd.command)}
            onMouseEnter={() => setSelectedIndex(index)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
              index === selectedIndex
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent/50"
            }`}
          >
            <span className="text-xl">{cmd.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{cmd.command}</div>
              <div className="text-xs text-muted-foreground truncate">
                {cmd.description}
              </div>
            </div>
            {index === selectedIndex && (
              <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border border-border">
                ↵
              </kbd>
            )}
          </button>
        ))}
      </div>

      {/* Footer hint */}
      <div className="px-3 py-2 border-t border-border bg-muted/30 text-xs text-muted-foreground flex items-center gap-3">
        <span>↑↓ Navigate</span>
        <span>↵ Select</span>
        <span>Esc Close</span>
      </div>
    </div>
  );
};

export default SlashCommandMenu;

