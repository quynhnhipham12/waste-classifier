import { Routes, Route } from "react-router-dom";
import Banner from "./pages/Banner";
import Home from "./pages/Home";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import BannerAdmin from "./pages/admin/BannerAdmin";
import SiteSettingsAdmin from "./pages/admin/SiteSettingsAdmin";
import WasteTypesAdmin from "./pages/admin/WasteTypesAdmin";
import ArticlesAdmin from "./pages/admin/ArticlesAdmin";
import ArticleEditor from "./pages/admin/ArticleEditor";
import ProtectedRoute from "./components/ProtectedRoute";
import HistoryAdmin from "./pages/admin/HistoryAdmin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Banner />} />
      <Route path="/home" element={<Home />} />
      <Route path="/bai-bao" element={<Articles />} />
      <Route path="/bai-bao/:id" element={<ArticleDetail />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="banner" element={<BannerAdmin />} />
        <Route path="settings" element={<SiteSettingsAdmin />} />
        <Route path="waste-types" element={<WasteTypesAdmin />} />
        <Route path="articles" element={<ArticlesAdmin />} />
        <Route path="articles/:id" element={<ArticleEditor />} />
        <Route path="history" element={<HistoryAdmin />} />
      </Route>
    </Routes>
  );
}

export default App;