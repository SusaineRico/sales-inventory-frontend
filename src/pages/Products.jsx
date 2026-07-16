import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import * as productsApi from "../api/products";

const emptyForm = {
  name: "",
  sku: "",
  category: "",
  price: "",
  costPrice: "",
  stockQuantity: "",
  lowStockThreshold: "10",
  unit: "pcs",
};

export default function Products() {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    productsApi.getProducts().then(setProducts).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError("");
  };

  const openEdit = (product) => {
    setForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      costPrice: product.costPrice,
      stockQuantity: product.stockQuantity,
      lowStockThreshold: product.lowStockThreshold,
      unit: product.unit,
    });
    setEditingId(product._id);
    setShowForm(true);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      price: Number(form.price),
      costPrice: Number(form.costPrice),
      stockQuantity: Number(form.stockQuantity),
      lowStockThreshold: Number(form.lowStockThreshold),
    };
    try {
      if (editingId) {
        await productsApi.updateProduct(editingId, payload);
      } else {
        await productsApi.createProduct(payload);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await productsApi.deleteProduct(id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs tracking-widest text-amber-dark uppercase mb-1">
            Inventory
          </p>
          <h1 className="text-2xl font-semibold text-ink">Products</h1>
        </div>
        {isAdmin && (
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-ink text-paper px-4 py-2 rounded-sm text-sm font-medium hover:bg-ink-light transition-colors"
          >
            <Plus size={16} />
            Add Product
          </button>
        )}
      </div>

      <div className="bg-white border border-line rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink/50">
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">SKU</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium text-right">Price</th>
              <th className="px-5 py-3 font-medium text-right">Stock</th>
              {isAdmin && <th className="px-5 py-3 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-ink/40 font-mono text-sm">
                  Loading...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-ink/40 font-mono text-sm">
                  No products yet.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p._id} className="hover:bg-paper-dim/50">
                  <td className="px-5 py-3 font-medium text-ink">{p.name}</td>
                  <td className="px-5 py-3 font-mono text-xs text-ink/60">{p.sku}</td>
                  <td className="px-5 py-3 text-ink/70">{p.category}</td>
                  <td className="px-5 py-3 text-right font-mono">₱{p.price.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right">
                    <span
                      className={`font-mono text-xs px-2 py-1 rounded-sm ${
                        p.isLowStock ? "bg-rust/10 text-rust" : "bg-sage/10 text-sage"
                      }`}
                    >
                      {p.stockQuantity} {p.unit}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 text-ink/50 hover:text-ink hover:bg-paper-dim rounded-sm"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="p-1.5 text-ink/50 hover:text-rust hover:bg-rust/10 rounded-sm"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit modal */}
      {showForm && (
        <div className="fixed inset-0 bg-ink/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-sm w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-ink">
                {editingId ? "Edit Product" : "Add Product"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-ink/40 hover:text-ink">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
              <div className="grid grid-cols-2 gap-3">
                <Field label="SKU" value={form.sku} onChange={(v) => setForm({ ...form, sku: v })} required mono />
                <Field label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Price (₱)" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} required mono />
                <Field label="Cost Price (₱)" type="number" value={form.costPrice} onChange={(v) => setForm({ ...form, costPrice: v })} required mono />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Stock Qty" type="number" value={form.stockQuantity} onChange={(v) => setForm({ ...form, stockQuantity: v })} required mono />
                <Field label="Low Stock At" type="number" value={form.lowStockThreshold} onChange={(v) => setForm({ ...form, lowStockThreshold: v })} mono />
                <Field label="Unit" value={form.unit} onChange={(v) => setForm({ ...form, unit: v })} />
              </div>

              {error && (
                <p className="text-sm text-rust bg-rust/10 border border-rust/20 rounded-sm px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-ink text-paper rounded-sm py-2.5 text-sm font-medium hover:bg-ink-light transition-colors mt-2"
              >
                {editingId ? "Save Changes" : "Create Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required, mono }) {
  return (
    <div>
      <label className="block text-xs font-medium text-ink/60 uppercase tracking-wide mb-1">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        step={type === "number" ? "0.01" : undefined}
        className={`w-full border border-line rounded-sm px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber ${
          mono ? "font-mono" : ""
        }`}
      />
    </div>
  );
}
