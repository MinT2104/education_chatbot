import { useEffect, useMemo, useState } from "react";
import schools from "../data/schools.json";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SchoolPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (school: { name: string }, remember: boolean) => void;
}

const SchoolPickerModal = ({
  open,
  onClose,
  onSelect,
}: SchoolPickerModalProps) => {
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [rememberChoice, setRememberChoice] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  const results = useMemo(() => {
    const query = debounced.trim().toLowerCase();
    if (!query) return schools;
    return schools.filter((s) => s.name.toLowerCase().includes(query));
  }, [debounced]);

  const handleSelect = (school: { id: string; name: string }) => {
    onSelect({ name: school.name }, rememberChoice);
    if (!rememberChoice) {
      onClose();
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-surface p-6 shadow-[0_8px_24px_rgba(0,0,0,.4),inset_0_0_0_1px_var(--border)]">
        <h2 className="text-lg font-semibold text-text">Choose your school</h2>
        <p className="text-sm text-text-subtle mt-1">
          Enter your school name to get personalized content
        </p>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name..."
          className="mt-3 w-full px-4 py-2 rounded-xl bg-surface-muted focus:outline-none focus:shadow-[0_0_0_3px_rgba(124,77,255,.12),inset_0_0_0_1px_rgba(124,77,255,.20)]"
        />
        <div className="mt-4 max-h-80 overflow-y-auto space-y-2">
          {results.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSelect(s)}
              className="w-full text-left px-4 py-2 rounded-xl bg-surface hover:bg-primary-500/8 transition-colors"
            >
              {s.name}
            </button>
          ))}
          {results.length === 0 && (
            <div className="text-sm text-text-subtle">No schools found</div>
          )}
        </div>
        <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
          <Checkbox
            id="remember-school"
            checked={rememberChoice}
            onCheckedChange={(checked) => setRememberChoice(checked as boolean)}
          />
          <Label
            htmlFor="remember-school"
            className="text-sm text-text cursor-pointer font-normal"
          >
            Do not ask me again
          </Label>
        </div>
      </div>
    </div>
  );
};

export default SchoolPickerModal;
