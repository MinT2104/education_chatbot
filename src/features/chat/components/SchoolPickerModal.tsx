import { useEffect, useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { chatService } from "../services/chatService";
import { X } from "lucide-react";

interface School {
  id: string;
  name: string;
  address?: string;
  country?: string;
}

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
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    if (open && schools.length === 0) {
      loadSchools();
    }
    // Reset search and remember choice when modal opens
    if (open) {
      setQ("");
      setRememberChoice(false);
    }
  }, [open]);

  const loadSchools = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await chatService.getSchools();
      setSchools(data);
    } catch (err: any) {
      console.error("Failed to load schools:", err);
      setError(err.response?.data?.message || "Failed to load schools");
    } finally {
      setLoading(false);
    }
  };

  const results = useMemo(() => {
    const query = debounced.trim().toLowerCase();
    if (!query) return schools;
    return schools.filter((s) => s.name.toLowerCase().includes(query));
  }, [debounced, schools]);

  const handleSelect = (school: { id: string; name: string }) => {
    onSelect({ name: school.name }, rememberChoice);
    // Always close the modal after selection
    onClose();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-surface p-6 shadow-[0_8px_24px_rgba(0,0,0,.4),inset_0_0_0_1px_var(--border)]">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute cursor-pointer right-3 top-3 rounded-md p-2 text-text-subtle hover:bg-surface-muted hover:text-text focus:outline-none focus:ring-2 focus:ring-primary-500/40"
        >
          <X className="cursor-pointer" size={18} />
        </button>
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
          disabled={loading}
        />
        <div className="mt-4 max-h-80 overflow-y-auto space-y-2">
          {loading && (
            <div className="text-sm text-text-subtle text-center py-8">
              Loading schools...
            </div>
          )}
          {error && (
            <div className="text-sm text-red-500 text-center py-4">
              {error}
              <button
                onClick={loadSchools}
                className="ml-2 text-primary-500 hover:underline"
              >
                Retry
              </button>
            </div>
          )}
          {!loading &&
            !error &&
            results.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelect(s)}
                className="w-full text-left px-4 py-2 rounded-xl bg-surface hover:bg-primary-500/8 transition-colors"
              >
                {s.name}
              </button>
            ))}
          {!loading && !error && results.length === 0 && schools.length > 0 && (
            <div className="text-sm text-text-subtle text-center py-4">
              No schools found matching "{debounced}"
            </div>
          )}
          {!loading && !error && schools.length === 0 && (
            <div className="text-sm text-text-subtle text-center py-4">
              No schools available
            </div>
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
