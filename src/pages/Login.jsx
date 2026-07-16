import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-mono text-xs tracking-widest text-amber-dark uppercase mb-1">
            System Access
          </p>
          <h1 className="text-2xl font-semibold text-ink">Sales &amp; Inventory</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-line rounded-sm p-7 space-y-4"
        >
          <div>
            <label className="block text-xs font-medium text-ink/60 uppercase tracking-wide mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-line rounded-sm px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink/60 uppercase tracking-wide mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-line rounded-sm px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-rust bg-rust/10 border border-rust/20 rounded-sm px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-paper rounded-sm py-2.5 text-sm font-medium hover:bg-ink-light transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
