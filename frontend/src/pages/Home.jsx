import { useState } from "react";
import apiClient from "../api/client";
import UploadZone from "../components/UploadZone";
import ResultCard from "../components/ResultCard";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Home() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = (f) => {
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setResult(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await apiClient.post("/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      setError("Không kết nối được tới máy chủ. Kiểm tra backend đã chạy chưa.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-eco-bg flex flex-col">
      <Header />

      <div className="flex-1 py-8 px-6">
        <div className="text-center mb-12">
          <p className="font-body text-eco-ink/60 mt-2">
            Tải ảnh rác thải lên để nhận diện và biết cách xử lý đúng
          </p>
        </div>

        {error && (
          <p className="text-center text-eco-accent font-body mb-6">{error}</p>
        )}

        {result ? (
          <ResultCard result={result} onReset={handleReset} />
        ) : (
          <UploadZone
            previewUrl={previewUrl}
            onFileSelect={handleFileSelect}
            onSubmit={handleSubmit}
            loading={loading}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Home;