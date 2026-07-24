import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import apiClient from "../../api/client";

function LogoUploader({ label, value, onChange }) {
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label className="block font-body text-sm text-eco-ink/70 mb-2">{label}</label>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl bg-eco-surface flex items-center justify-center overflow-hidden border border-eco-primary/10">
          {value ? (
            <img src={value} alt={label} className="w-full h-full object-contain" />
          ) : (
            <Upload className="w-5 h-5 text-eco-primary/40" />
          )}
        </div>
        <label className="cursor-pointer inline-flex items-center gap-2 bg-eco-surface hover:bg-eco-primary/10 text-eco-primary font-semibold text-sm px-4 py-2 rounded-full transition">
          <Upload className="w-4 h-4" />
          {value ? "Đổi ảnh khác" : "Chọn ảnh"}
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
      </div>
    </div>
  );
}

function SiteSettingsAdmin() {
  const [form, setForm] = useState({
    logo_header_url: "",
    logo_footer_url: "",
    logo_admin_url: "",
    brand_name: "",
    footer_description: "",
    footer_email: "",
    footer_email_link: "",
    footer_phone: "",
    footer_phone_link: "",
    footer_address: "",
    footer_address_link: "",
  });
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiClient.get("/site-settings").then((res) => {
      setForm({
        logo_header_url: res.data.logo_header_url || "",
        logo_footer_url: res.data.logo_footer_url || "",
        logo_admin_url: res.data.logo_admin_url || "",
        brand_name: res.data.brand_name || "",
        footer_description: res.data.footer_description || "",
        footer_email: res.data.footer_email || "",
        footer_email_link: res.data.footer_email_link || "",
        footer_phone: res.data.footer_phone || "",
        footer_phone_link: res.data.footer_phone_link || "",
        footer_address: res.data.footer_address || "",
        footer_address_link: res.data.footer_address_link || "",
      });
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await apiClient.put("/admin/site-settings", form);
      setMessage({ type: "success", text: "Đã lưu cài đặt thành công." });
    } catch (err) {
      setMessage({ type: "error", text: "Lưu thất bại. Kiểm tra lại đăng nhập." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-eco-primary mb-6">
        Logo & Footer
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="block font-body text-sm text-eco-ink/70 mb-1">
            Tên thương hiệu
          </label>
          <input
            type="text"
            value={form.brand_name}
            onChange={(e) => setForm({ ...form, brand_name: e.target.value })}
            className="w-full border border-eco-primary/20 rounded-xl px-4 py-2.5 font-body outline-none focus:border-eco-primary"
          />
        </div>

        <LogoUploader
          label="Logo hiển thị ở Header (đầu trang)"
          value={form.logo_header_url}
          onChange={(val) => setForm({ ...form, logo_header_url: val })}
        />

        <LogoUploader
          label="Logo hiển thị ở Footer (cuối trang)"
          value={form.logo_footer_url}
          onChange={(val) => setForm({ ...form, logo_footer_url: val })}
        />

        <LogoUploader
          label="Logo hiển thị ở trang Admin (cạnh chữ 'Admin')"
          value={form.logo_admin_url}
          onChange={(val) => setForm({ ...form, logo_admin_url: val })}
        />

        <hr className="border-eco-primary/10 my-1" />

        <div>
          <label className="block font-body text-sm text-eco-ink/70 mb-1">
            Mô tả footer
          </label>
          <textarea
            value={form.footer_description}
            onChange={(e) => setForm({ ...form, footer_description: e.target.value })}
            rows={4}
            className="w-full border border-eco-primary/20 rounded-xl px-4 py-2.5 font-body outline-none focus:border-eco-primary resize-none"
          />
        </div>

        <div>
          <label className="block font-body text-sm text-eco-ink/70 mb-1">Email liên hệ</label>
          <input
            type="text"
            value={form.footer_email}
            onChange={(e) => setForm({ ...form, footer_email: e.target.value })}
            className="w-full border border-eco-primary/20 rounded-xl px-4 py-2.5 font-body outline-none focus:border-eco-primary mb-2"
          />
          <input
            type="text"
            placeholder="Link khi bấm vào (không bắt buộc, vd: mailto:contact@ecoflow.vn)"
            value={form.footer_email_link}
            onChange={(e) => setForm({ ...form, footer_email_link: e.target.value })}
            className="w-full border border-eco-primary/10 rounded-xl px-4 py-2 text-sm font-body outline-none focus:border-eco-primary"
          />
        </div>

        <div>
          <label className="block font-body text-sm text-eco-ink/70 mb-1">Số điện thoại</label>
          <input
            type="text"
            value={form.footer_phone}
            onChange={(e) => setForm({ ...form, footer_phone: e.target.value })}
            className="w-full border border-eco-primary/20 rounded-xl px-4 py-2.5 font-body outline-none focus:border-eco-primary mb-2"
          />
          <input
            type="text"
            placeholder="Link khi bấm vào (không bắt buộc, vd: tel:0123456789)"
            value={form.footer_phone_link}
            onChange={(e) => setForm({ ...form, footer_phone_link: e.target.value })}
            className="w-full border border-eco-primary/10 rounded-xl px-4 py-2 text-sm font-body outline-none focus:border-eco-primary"
          />
        </div>

        <div>
          <label className="block font-body text-sm text-eco-ink/70 mb-1">Địa chỉ</label>
          <input
            type="text"
            value={form.footer_address}
            onChange={(e) => setForm({ ...form, footer_address: e.target.value })}
            className="w-full border border-eco-primary/20 rounded-xl px-4 py-2.5 font-body outline-none focus:border-eco-primary mb-2"
          />
          <input
            type="text"
            placeholder="Link khi bấm vào (không bắt buộc, vd: link Google Maps)"
            value={form.footer_address_link}
            onChange={(e) => setForm({ ...form, footer_address_link: e.target.value })}
            className="w-full border border-eco-primary/10 rounded-xl px-4 py-2 text-sm font-body outline-none focus:border-eco-primary"
          />
        </div>

        {message && (
          <p className={`font-body text-sm ${message.type === "success" ? "text-eco-primary" : "text-eco-accent"}`}>
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="bg-eco-primary hover:bg-eco-primary-dark disabled:opacity-50 text-white font-semibold py-3 rounded-full transition"
        >
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </form>
    </div>
  );
}

export default SiteSettingsAdmin;