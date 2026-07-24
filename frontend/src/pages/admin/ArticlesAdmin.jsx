import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import apiClient from "../../api/client";

function ArticlesAdmin() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);

  const loadArticles = () => {
    apiClient.get("/admin/articles").then((res) => setArticles(res.data));
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Xoá bài báo này?")) return;
    await apiClient.delete(`/admin/articles/${id}`);
    loadArticles();
  };

  const toggleVisibility = async (id) => {
    await apiClient.patch(`/admin/articles/${id}/toggle`);
    loadArticles();
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-eco-primary">
          Bài báo
        </h1>
        <button
          onClick={() => navigate("/admin/articles/new")}
          className="flex items-center gap-2 bg-eco-primary hover:bg-eco-primary-dark text-white font-semibold px-5 py-2.5 rounded-full transition"
        >
          <Plus className="w-4 h-4" /> Tạo bài mới
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {articles.length === 0 && (
          <p className="font-body text-eco-ink/60">Chưa có bài báo nào.</p>
        )}
        {articles.map((a) => (
          <div
            key={a.id}
            className="bg-white rounded-2xl p-4 border border-eco-primary/10 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              {a.cover_image_url && (
                <img
                  src={a.cover_image_url}
                  alt={a.title}
                  className="w-16 h-16 object-cover rounded-xl"
                />
              )}
              <div>
                <p className="font-body font-semibold" style={{ color: a.title_color }}>
                  {a.title}
                </p>
                <p className="font-body text-xs text-eco-ink/50">
                  {a.published ? "Đã đăng" : "Đang ẩn"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/admin/articles/${a.id}`)}
                className="p-2 rounded-full hover:bg-eco-surface text-eco-primary"
                title="Sửa bài"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleVisibility(a.id)}
                className="p-2 rounded-full hover:bg-eco-surface text-eco-primary"
                title={a.published ? "Đang hiện — bấm để ẩn" : "Đang ẩn — bấm để hiện"}
              >
                {a.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleDelete(a.id)}
                className="p-2 rounded-full hover:bg-eco-accent/10 text-eco-accent"
                title="Xoá bài"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArticlesAdmin;