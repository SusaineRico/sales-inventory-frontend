import { useEffect, useState } from "react";
import * as salesApi from "../api/sales";

export default function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const load = () => {
    setLoading(true);
    salesApi.getSales(from || undefined, to || undefined).then(setSales).finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-xs tracking-widest text-amber-dark uppercase mb-1">
            Records
          </p>
          <h1 className="text-2xl font-semibold text-ink">Sales History</h1>
        </div>

        <div className="flex items-end gap-2">
          <div>
            <label className="block text-xs font-medium text-ink/60 uppercase tracking-wide mb-1">
              From
            </label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="border border-line rounded-sm px-2.5 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber/40"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink/60 uppercase tracking-wide mb-1">
              To
            </label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="border border-line rounded-sm px-2.5 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber/40"
            />
          </div>
          <button
            onClick={load}
            className="bg-ink text-paper px-4 py-1.5 rounded-sm text-sm font-medium hover:bg-ink-light transition-colors"
          >
            Filter
          </button>
        </div>
      </div>

      <div className="bg-white border border-line rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink/50">
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Items</th>
              <th className="px-5 py-3 font-medium">Sold By</th>
              <th className="px-5 py-3 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-ink/40 font-mono text-sm">
                  Loading...
                </td>
              </tr>
            ) : sales.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-ink/40 font-mono text-sm">
                  No sales recorded in this range.
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale._id} className="hover:bg-paper-dim/50 align-top">
                  <td className="px-5 py-3 font-mono text-xs text-ink/60 whitespace-nowrap">
                    {new Date(sale.createdAt).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-ink">{sale.customerName}</td>
                  <td className="px-5 py-3 text-ink/70">
                    {sale.items.map((i) => `${i.productName} ×${i.quantity}`).join(", ")}
                  </td>
                  <td className="px-5 py-3 text-ink/60">{sale.soldBy?.name || "—"}</td>
                  <td className="px-5 py-3 text-right font-mono font-medium">
                    ₱{sale.totalAmount.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
