import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import apiClient from "../../api/client";

function BannerAdmin() {
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    image_url: "",
    link_url: "",
  });
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiClient.get("/banner").then((res) => {
      setForm({
        title: res.data.title || "",
        subtitle: res.data.subtitle || "",
        image_url: res.data.image_url || "",
        link_url: res.data.link_url || "",
      });
    });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, image_url: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await apiClient.put("/admin/banner", form);
      setMessage({ type: "success", text: "Đã lưu banner thành công." });
    } catch (err) {
      setMessage({ type: "error", text: "Lưu thất bại. Kiểm tra lại đăng nhập." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-eco-primary mb-6">
        Quản lý Banner
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block font-body text-sm text-eco-ink/70 mb-1">
            Tiêu đề
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-eco-primary/20 rounded-xl px-4 py-2.5 font-body outline-none focus:border-eco-primary"
          />
        </div>

        <div>
          <label className="block font-body text-sm text-eco-ink/70 mb-1">
            Phụ đề
          </label>
          <input
            type="text"
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            className="w-full border border-eco-primary/20 rounded-xl px-4 py-2.5 font-body outline-none focus:border-eco-primary"
          />
        </div>

        <div>
          <label className="block font-body text-sm text-eco-ink/70 mb-2">
            Ảnh nền banner
          </label>
          <div className="flex items-center gap-4">
            <div className="w-full max-w-md aspect-[3/1] rounded-xl bg-eco-surface overflow-hidden border border-eco-primary/10">
              {form.image_url ? (
                <img src={form.image_url} alt="Ảnh banner" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Upload className="w-5 h-5 text-eco-primary/40" />
                </div>
              )}
            </div>
          </div>
          <label className="cursor-pointer inline-flex items-center gap-2 bg-eco-surface hover:bg-eco-primary/10 text-eco-primary font-semibold text-sm px-4 py-2 rounded-full transition mt-3 w-fit">
            <Upload className="w-4 h-4" />
            {form.image_url ? "Đổi ảnh khác" : "Chọn ảnh"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {message && (
          <p
            className={`font-body text-sm ${
              message.type === "success" ? "text-eco-primary" : "text-eco-accent"
            }`}
          >
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

export default BannerAdmin;