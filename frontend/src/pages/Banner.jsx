import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import apiClient from "../api/client";

function Banner() {
  const navigate = useNavigate();
  const [banner, setBanner] = useState({
    title: "EcoFlow",
    subtitle: "Nhận diện rác thải, sống xanh mỗi ngày",
    image_url: null,
  });

  useEffect(() => {
    apiClient
      .get("/banner")
      .then((res) => setBanner(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="relative min-h-screen bg-eco-bg overflow-hidden flex flex-col items-center justify-center px-6">
      {banner.image_url && (
        <>
          <img
            src={banner.image_url}
            alt="Banner"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Lớp phủ nhẹ chỉ để chữ dễ đọc, không làm mờ toàn bộ ảnh */}
          <div className="absolute inset-0 bg-black/10" />
        </>
      )}

      <div className="relative z-10 text-center max-w-2xl">
        <h1 className="font-display text-5xl md:text-6xl font-extrabold text-eco-primary drop-shadow-sm mb-4">
          {banner.title}
        </h1>
        <p className="font-body text-lg text-eco-ink/80 drop-shadow-sm">
          {banner.subtitle}
        </p>
      </div>

      <button
        onClick={() => navigate("/home")}
        className="absolute bottom-16 z-20 w-16 h-16 rounded-full bg-eco-primary hover:bg-eco-primary-dark flex items-center justify-center shadow-lg ring-4 ring-white transition-transform hover:scale-110"
        aria-label="Vào trang chủ"
      >
        <Search className="w-7 h-7 text-white" />
      </button>
    </div>
  );
}

export default Banner;