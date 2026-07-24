import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import apiClient from "../../api/client";

function HistoryAdmin() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    apiClient
      .get("/admin/history")
      .then((res) => setHistory(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await apiClient.get("/admin/history/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "lich_su_phan_loai.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Xuất file thất bại. Kiểm tra lại đăng nhập.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-eco-primary">
          Lịch sử phân loại
        </h1>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 bg-eco-primary hover:bg-eco-primary-dark disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-full transition"
        >
          <Download className="w-4 h-4" />
          {exporting ? "Đang xuất..." : "Xuất Excel"}
        </button>
      </div>

      {loading ? (
        <p className="font-body text-eco-ink/60">Đang tải dữ liệu...</p>
      ) : history.length === 0 ? (
        <p className="font-body text-eco-ink/60">Chưa có dữ liệu phân loại nào.</p>
      ) : (
        <div className="bg-white rounded-2xl border border-eco-primary/10 overflow-hidden">
          <table className="w-full text-sm font-body">
            <thead className="bg-eco-surface">
              <tr>
                <th className="text-left px-4 py-3">Ảnh</th>
                <th className="text-left px-4 py-3">Thời gian</th>
                <th className="text-left px-4 py-3">Loại rác</th>
                <th className="text-left px-4 py-3">Số vật thể</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row) => {
                const detections = row.detections || [];
                const classNames = [
                  ...new Set(detections.map((d) => d.class_display || d.class_name)),
                ].join(", ") || "Không phát hiện";
                return (
                  <tr key={row.id} className="border-t border-eco-primary/10">
                    <td className="px-4 py-3">
                      {row.image_url && (
                        <img
                          src={row.image_url}
                          alt="Ảnh phân loại"
                          className="w-14 h-14 object-cover rounded-lg"
                        />
                      )}
                    </td>
                    <td className="px-4 py-3 text-eco-ink/70">
                      {row.created_at
                        ? new Date(row.created_at).toLocaleString("vi-VN")
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-eco-ink/70">{classNames}</td>
                    <td className="px-4 py-3 text-eco-ink/70">{detections.length}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HistoryAdmin;