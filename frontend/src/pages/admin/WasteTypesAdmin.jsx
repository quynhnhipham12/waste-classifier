import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import apiClient from "../../api/client";

const CLASS_ORDER = ["GLASS", "METAL", "CARDBOARD", "BIODEGRADABLE", "PLASTIC", "PAPER"];

function WasteTypesAdmin() {
  const [wasteTypes, setWasteTypes] = useState({});
  const [activeTab, setActiveTab] = useState("GLASS");
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiClient.get("/waste-types").then((res) => setWasteTypes(res.data));
  }, []);

  const current = wasteTypes[activeTab];

  const updateField = (field, value) => {
    setWasteTypes((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [field]: value },
    }));
  };

  const updateListItem = (listField, idx, value) => {
    const newList = [...(current[listField] || [])];
    newList[idx] = value;
    updateField(listField, newList);
  };

  const addListItem = (listField) => {
    updateField(listField, [...(current[listField] || []), ""]);
  };

  const removeListItem = (listField, idx) => {
    const newList = (current[listField] || []).filter((_, i) => i !== idx);
    updateField(listField, newList);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await apiClient.put(`/admin/waste-types/${activeTab}`, {
        display_name: current.display_name,
        color: current.color,
        process: current.process,
        should_list: current.should_list || [],
        avoid_list: current.avoid_list || [],
      });
      setMessage({ type: "success", text: `Đã lưu thông tin "${current.display_name}".` });
    } catch (err) {
      setMessage({ type: "error", text: "Lưu thất bại. Kiểm tra lại đăng nhập." });
    } finally {
      setSaving(false);
    }
  };

  if (!current) {
    return <p className="font-body text-eco-ink/60">Đang tải dữ liệu...</p>;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-eco-primary mb-6">
        Quản lý 6 loại rác
      </h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {CLASS_ORDER.map((cls) => (
          <button
            key={cls}
            onClick={() => {
              setActiveTab(cls);
              setMessage(null);
            }}
            className={`px-4 py-2 rounded-full font-body text-sm transition ${
              activeTab === cls
                ? "bg-eco-primary text-white"
                : "bg-white border border-eco-primary/20 text-eco-ink/70 hover:bg-eco-surface"
            }`}
          >
            {wasteTypes[cls]?.display_name || cls}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-eco-primary/10 flex flex-col gap-5">
        <div>
          <label className="block font-body text-sm text-eco-ink/70 mb-1">
            Tên hiển thị
          </label>
          <input
            type="text"
            value={current.display_name || ""}
            onChange={(e) => updateField("display_name", e.target.value)}
            className="w-full border border-eco-primary/20 rounded-xl px-4 py-2.5 font-body outline-none focus:border-eco-primary"
          />
        </div>

        <div>
          <label className="block font-body text-sm text-eco-ink/70 mb-1">
            Cách xử lý
          </label>
          <textarea
            value={current.process || ""}
            onChange={(e) => updateField("process", e.target.value)}
            rows={3}
            className="w-full border border-eco-primary/20 rounded-xl px-4 py-2.5 font-body outline-none focus:border-eco-primary resize-none"
          />
        </div>

        {["should_list", "avoid_list"].map((listField) => (
          <div key={listField}>
            <label className="block font-body text-sm text-eco-ink/70 mb-2">
              {listField === "should_list" ? "Nên làm" : "Không nên"}
            </label>
            <div className="flex flex-col gap-2">
              {(current[listField] || []).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateListItem(listField, idx, e.target.value)}
                    className="flex-1 border border-eco-primary/20 rounded-xl px-4 py-2 font-body text-sm outline-none focus:border-eco-primary"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem(listField, idx)}
                    className="text-eco-accent hover:bg-eco-accent/10 rounded-full p-1.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem(listField)}
                className="flex items-center gap-1.5 text-eco-primary text-sm font-body mt-1 hover:underline w-fit"
              >
                <Plus className="w-4 h-4" /> Thêm dòng
              </button>
            </div>
          </div>
        ))}

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
          onClick={handleSave}
          disabled={saving}
          className="bg-eco-primary hover:bg-eco-primary-dark disabled:opacity-50 text-white font-semibold py-3 rounded-full transition"
        >
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </div>
  );
}

export default WasteTypesAdmin;