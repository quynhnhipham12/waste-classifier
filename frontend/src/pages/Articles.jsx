import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import apiClient from "../api/client";

function Articles() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    apiClient.get("/articles").then((res) => setArticles(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-eco-bg flex flex-col">
      <Header />

      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        <h1 className="font-display text-3xl font-extrabold text-eco-primary mb-2 text-center">
          Góc môi trường
        </h1>
        <p className="font-body text-eco-ink/60 text-center mb-10">
          Những câu chuyện và kiến thức về sống xanh, giảm rác thải
        </p>

        {articles.length === 0 ? (
          <p className="text-center font-body text-eco-ink/50">
            Chưa có bài báo nào được đăng.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a) => (
              <div
                key={a.id}
                onClick={() => navigate(`/bai-bao/${a.id}`)}
                className="bg-white rounded-2xl overflow-hidden border border-eco-primary/10 cursor-pointer hover:shadow-md transition"
              >
                {a.cover_image_url && (
                  <img
                    src={a.cover_image_url}
                    alt={a.title}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-5">
                  <h2
                    className="font-display text-lg font-bold mb-1"
                    style={{ color: a.title_color }}
                  >
                    {a.title}
                  </h2>
                  <p className="font-body text-xs text-eco-ink/40">
                    {new Date(a.created_at).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Articles;