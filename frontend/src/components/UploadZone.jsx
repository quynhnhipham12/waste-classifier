import { Upload, ImageIcon } from "lucide-react";

function UploadZone({ previewUrl, onFileSelect, onSubmit, loading }) {
  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-eco-primary/30 rounded-3xl bg-white flex flex-col items-center justify-center p-10 text-center gap-4"
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Ảnh đã chọn"
            className="max-h-72 rounded-xl object-contain"
          />
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-eco-surface flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-eco-primary" />
            </div>
            <p className="font-body text-eco-ink/70">
              Kéo thả ảnh vào đây, hoặc chọn ảnh từ máy tính
            </p>
          </>
        )}

        <label className="cursor-pointer inline-flex items-center gap-2 bg-eco-surface hover:bg-eco-primary/10 text-eco-primary font-semibold px-5 py-2.5 rounded-full transition">
          <Upload className="w-4 h-4" />
          {previewUrl ? "Chọn ảnh khác" : "Chọn ảnh"}
          <input type="file" accept="image/*" onChange={handleChange} className="hidden" />
        </label>
      </div>

      {previewUrl && (
        <button
          onClick={onSubmit}
          disabled={loading}
          className="mt-6 w-full bg-eco-accent hover:opacity-90 disabled:opacity-50 text-white font-semibold py-3.5 rounded-full transition"
        >
          {loading ? "Đang phân loại..." : "Phân loại rác thải"}
        </button>
      )}
    </div>
  );
}

export default UploadZone;