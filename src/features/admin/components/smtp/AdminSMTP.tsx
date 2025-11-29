import { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";
import { toast } from "react-toastify";

export function AdminSMTP() {
  const [, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    smtp_host: "",
    smtp_port: "",
    smtp_user: "",
    smtp_pass: "",
    smtp_secure: "false",
    email_from: "",
  });

  useEffect(() => {
    setLoading(true);
    adminService
      .getAppSettings()
      .then((res) => {
        if (res && res.settings) {
          setForm((prev) => ({
            ...prev,
            smtp_host: res.settings.smtp_host || prev.smtp_host,
            smtp_port: res.settings.smtp_port || prev.smtp_port,
            smtp_user: res.settings.smtp_user || prev.smtp_user,
            smtp_pass: res.settings.smtp_pass || prev.smtp_pass,
            smtp_secure: res.settings.smtp_secure || prev.smtp_secure,
            email_from: res.settings.email_from || prev.email_from,
          }));
        }
      })
      .catch((err) => {
        console.error("Failed to load settings:", err);
        toast.error("Failed to load settings");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: Record<string, string> = {
        smtp_host: form.smtp_host || "",
        smtp_port: form.smtp_port || "",
        smtp_user: form.smtp_user || "",
        smtp_pass: form.smtp_pass || "",
        smtp_secure: form.smtp_secure || "false",
        email_from: form.email_from || "",
      };
      const res = await adminService.updateAppSettings(payload);
      if (res && res.success) {
        toast.success("SMTP settings saved");
      } else {
        toast.error("Failed to save settings");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">SMTP / Email settings</h3>
      <p className="text-sm text-muted-foreground">Configure SMTP used for sending verification and other emails.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">SMTP Host</label>
          <input
            value={form.smtp_host}
            onChange={(e) => setForm({ ...form, smtp_host: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="smtp.example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">SMTP Port</label>
          <input
            value={form.smtp_port}
            onChange={(e) => setForm({ ...form, smtp_port: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="587"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">SMTP User</label>
          <input
            value={form.smtp_user}
            onChange={(e) => setForm({ ...form, smtp_user: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="no-reply@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">SMTP Password</label>
          <input
            value={form.smtp_pass}
            onChange={(e) => setForm({ ...form, smtp_pass: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="secret"
            type="password"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">SMTP Secure</label>
          <select
            value={form.smtp_secure}
            onChange={(e) => setForm({ ...form, smtp_secure: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email From</label>
          <input
            value={form.email_from}
            onChange={(e) => setForm({ ...form, email_from: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="IDEVX <no-reply@idevx.ai>"
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save settings"}
        </button>
      </div>
    </div>
  );
}
