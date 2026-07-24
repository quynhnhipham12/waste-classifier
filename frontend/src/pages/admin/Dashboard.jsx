import { useEffect, useState } from "react";
import { ScanLine, Recycle, Newspaper, TrendingUp } from "lucide-react";
import apiClient from "../../api/client";

const CARD_COLORS = ["bg-eco-primary", "bg-eco-accent", "bg-eco-glass", "bg-eco-metal", "bg-eco-plastic", "bg-eco-paper"];

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-eco-primary/10 p-6 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-eco-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6 text-eco-primary" />
      </div>
      <div>
        <p className="font-body text-sm text-eco-ink/60">{label}</p>
        <p className="font-display text-2xl font-bold text-eco-ink">{value}</p>
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    apiClient.get("/admin/stats").then((res) => setStats(res.data)).catch(() => {});
  }, []);

  const maxCount = stats?.by_class?.length ? Math.max(...stats.by_class.map((c) => c.count)) : 1;

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-2xl font-bold text-eco-primary mb-1">Tổng quan</h1>
      <p className="font-body text-eco-ink/60 mb-8">Chào mừng bạn quay lại trang quản trị EcoFlow.</p>

      {!stats ? (
        <p className="font-body text-eco-ink/50">Đang tải dữ liệu...</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <StatCard icon={ScanLine} label="Lượt phân loại" value={stats.total_scans} />
            <StatCard icon={Recycle} label="Vật thể đã nhận diện" value={stats.total_detections} />
            <StatCard icon={Newspaper} label="Bài báo đã đăng" value={stats.total_articles} />
          </div>

          <div className="bg-white rounded-2xl border border-eco-primary/10 p-6">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-4 h-4 text-eco-primary" />
              <h2 className="font-display font-semibold text-eco-ink">Tỉ lệ loại rác được phát hiện</h2>
            </div>

            {stats.by_class.length === 0 ? (
              <p className="font-body text-sm text-eco-ink/50">Chưa có dữ liệu phân loại nào.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {stats.by_class.map((c, i) => (
                  <div key={c.name} className="flex items-center gap-3">
                    <span className="w-28 shrink-0 font-body text-sm text-eco-ink/70">{c.name}</span>
                    <div className="flex-1 h-3 bg-eco-surface rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${CARD_COLORS[i % CARD_COLORS.length]}`}
                        style={{ width: `${(c.count / maxCount) * 100}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-body text-sm font-semibold text-eco-ink/70">{c.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;