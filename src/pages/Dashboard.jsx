import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { AlertTriangle, TrendingUp, Receipt } from "lucide-react";
import { getSalesSummary } from "../api/sales";
import { getProducts } from "../api/products";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSalesSummary(), getProducts(true)])
      .then(([summaryData, lowStockData]) => {
        setSummary(summaryData);
        setLowStock(lowStockData);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-ink/50 text-sm font-mono">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs tracking-widest text-amber-dark uppercase mb-1">
          Overview
        </p>
        <h1 className="text-2xl font-semibold text-ink">Today's Dashboard</h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          icon={TrendingUp}
          label="Today's Sales"
          value={`₱${summary.todayTotalSales.toLocaleString()}`}
          accent="sage"
        />
        <StatCard
          icon={Receipt}
          label="Transactions Today"
          value={summary.todayTransactionCount}
          accent="amber"
        />
        <StatCard
          icon={AlertTriangle}
          label="Low Stock Items"
          value={lowStock.length}
          accent="rust"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Top products chart */}
        <div className="bg-white border border-line rounded-sm p-6">
          <h2 className="text-sm font-semibold text-ink mb-4">Top Selling Products</h2>
          {summary.topProducts.length === 0 ? (
            <p className="text-sm text-ink/40 font-mono">No sales recorded yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={summary.topProducts} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ddd7c8" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} stroke="#1a2332" />
                <YAxis
                  type="category"
                  dataKey="_id"
                  width={110}
                  tick={{ fontSize: 11 }}
                  stroke="#1a2332"
                />
                <Tooltip
                  contentStyle={{ fontSize: 12, fontFamily: "JetBrains Mono", borderRadius: 2 }}
                />
                <Bar dataKey="totalSold" fill="#d4a12e" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Low stock list */}
        <div className="bg-white border border-line rounded-sm p-6">
          <h2 className="text-sm font-semibold text-ink mb-4">Needs Restocking</h2>
          {lowStock.length === 0 ? (
            <p className="text-sm text-sage font-mono">All stock levels are healthy.</p>
          ) : (
            <ul className="divide-y divide-line">
              {lowStock.map((p) => (
                <li key={p._id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink">{p.name}</p>
                    <p className="text-xs font-mono text-ink/40">{p.sku}</p>
                  </div>
                  <span className="text-xs font-mono bg-rust/10 text-rust px-2 py-1 rounded-sm">
                    {p.stockQuantity} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }) {
  const accentColors = {
    sage: "text-sage bg-sage/10",
    amber: "text-amber-dark bg-amber/10",
    rust: "text-rust bg-rust/10",
  };

  return (
    <div className="bg-white border border-line rounded-sm p-5">
      <div className={`inline-flex p-2 rounded-sm mb-3 ${accentColors[accent]}`}>
        <Icon size={18} strokeWidth={2} />
      </div>
      <p className="text-xs text-ink/50 uppercase tracking-wide font-medium">{label}</p>
      <p className="text-2xl font-mono font-semibold text-ink mt-1">{value}</p>
    </div>
  );
}
