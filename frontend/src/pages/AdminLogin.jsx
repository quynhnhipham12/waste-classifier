import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import apiClient from "../api/client";

function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiClient.post("/admin/login", { username, password });
      localStorage.setItem("admin_token", res.data.access_token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Sai tài khoản hoặc mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-eco-bg flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-sm border border-eco-primary/10"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-eco-surface flex items-center justify-center mb-3">
            <Lock className="w-6 h-6 text-eco-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold text-eco-primary">
            Đăng nhập Admin
          </h1>
        </div>

        <label className="block font-body text-sm text-eco-ink/70 mb-1">
          Tài khoản
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-eco-primary/20 rounded-full px-4 py-2.5 mb-4 font-body outline-none focus:border-eco-primary"
          required
        />

        <label className="block font-body text-sm text-eco-ink/70 mb-1">
          Mật khẩu
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-eco-primary/20 rounded-full px-4 py-2.5 mb-4 font-body outline-none focus:border-eco-primary"
          required
        />

        {error && (
          <p className="text-eco-accent text-sm font-body mb-4 text-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-eco-primary hover:bg-eco-primary-dark disabled:opacity-50 text-white font-semibold py-3 rounded-full transition"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;