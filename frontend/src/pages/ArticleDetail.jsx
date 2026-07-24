import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import apiClient from "../api/client";

function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    apiClient.get(`/articles/${id}`).then((res) => setArticle(res.data));
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen bg-eco-bg flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="font-body text-eco-ink/50">Đang tải bài báo...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-eco-bg flex flex-col">
      <Header />

      <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-10">
        {article.cover_image_url && (
          <img
            src={article.cover_image_url}
            alt={article.title}
            className="w-full max-h-96 object-cover rounded-2xl mb-6"
          />
        )}

        <h1
          className="font-display text-3xl font-extrabold mb-2"
          style={{ color: article.title_color }}
        >
          {article.title}
        </h1>
        <p className="font-body text-xs text-eco-ink/40 mb-8">
          {new Date(article.created_at).toLocaleDateString("vi-VN")}
        </p>

        <div className="flex flex-col gap-6">
          {(article.content_blocks || []).map((block) => {
            if (block.type === "text") {
              return (
                <div
                  key={block.id}
                  className="font-body leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: block.html || "" }}
                />
              );
            }
            if (block.type === "table") {
              const rows = block.rows || [];
              return (
                <table key={block.id} className="border-collapse w-full">
                  <tbody>
                    {rows.map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, c) => (
                          <td
                            key={c}
                            className="border border-eco-primary/20 px-4 py-2 font-body text-sm"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              );
            }
            if (block.type === "image") {
              return block.url ? (
                <img
                  key={block.id}
                  src={block.url}
                  alt=""
                  className="w-full rounded-2xl object-cover"
                />
              ) : null;
            }
            return null;
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ArticleDetail;