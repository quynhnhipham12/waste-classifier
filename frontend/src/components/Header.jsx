import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Newspaper, Home } from "lucide-react";
import apiClient from "../api/client";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [settings, setSettings] = useState({ logo_header_url: null, brand_name: "EcoFlow" });
  const isArticlesPage = location.pathname.startsWith("/bai-bao");

  useEffect(() => {
    apiClient
      .get("/site-settings")
      .then((res) => setSettings(res.data))
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-eco-primary/10">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          {settings.logo_header_url && (
            <img
              src={settings.logo_header_url}
              alt={settings.brand_name || "EcoFlow"}
              className="h-14 w-44 object-contain transition-transform group-hover:scale-105"
            />
          )}
    
        </div>

        <nav className="flex items-center gap-3">
          <button
            onClick={() => navigate("/home")}
            className={`flex items-center gap-1.5 font-body text-sm font-medium px-4 py-2 rounded-full transition ${
              !isArticlesPage
                ? "bg-eco-primary text-white"
                : "text-eco-ink/70 hover:bg-eco-surface"
            }`}
          >
            <Home className="w-4 h-4" />
            Trang chủ
          </button>

          <button
            onClick={() => navigate("/bai-bao")}
            className={`flex items-center gap-1.5 font-body text-sm font-medium px-4 py-2 rounded-full transition shadow-sm ${
              isArticlesPage
                ? "bg-eco-accent text-white"
                : "bg-eco-accent/10 text-eco-accent hover:bg-eco-accent hover:text-white"
            }`}
          >
            <Newspaper className="w-4 h-4" />
            Góc môi trường
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;