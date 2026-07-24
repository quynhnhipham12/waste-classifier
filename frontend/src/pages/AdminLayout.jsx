import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Settings,
  BookOpen,
  Newspaper,
  History,
  LogOut,
} from "lucide-react";
import apiClient from "../api/client";

const menuItems = [
  { path: "/admin/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { path: "/admin/banner", label: "Banner", icon: ImageIcon },
  { path: "/admin/settings", label: "Logo & Footer", icon: Settings },
  { path: "/admin/waste-types", label: "Cẩm nang rác thải", icon: BookOpen },
  { path: "/admin/articles", label: "Bài báo", icon: Newspaper },
  { path: "/admin/history", label: "Lịch sử phân loại", icon: History },
];

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    apiClient
      .get("/site-settings")
      .then((res) => setLogoUrl(res.data.logo_admin_url))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-eco-bg flex">
      <aside className="w-64 bg-white border-r border-eco-primary/10 flex flex-col py-8 px-4">
        <div className="flex items-center gap-2 px-3 mb-8">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-9 h-9 object-contain rounded-xl" />
          ) : null}
          <h2 className="font-display text-xl font-extrabold text-eco-primary">Admin</h2>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {menuItems.map(({ path, label, icon: Icon }) => {
            const active = location.pathname.startsWith(path);
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-full font-body text-sm text-left transition ${
                  active
                    ? "bg-eco-primary text-white"
                    : "text-eco-ink/70 hover:bg-eco-surface"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-full font-body text-sm text-eco-accent hover:bg-eco-accent/10 transition"
        >
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;