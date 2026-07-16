import { useEffect, useState } from "react";
import { Plus, Minus, Trash2, Search } from "lucide-react";
import * as productsApi from "../api/products";
import * as salesApi from "../api/sales";

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]); // [{ product, quantity }]
  const [customerName, setCustomerName] = useState("");
  const [completedSale, setCompletedSale] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    productsApi.getProducts().then(setProducts);
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stockQuantity) }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQty = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product._id === productId
            ? {
                ...item,
                quantity: Math.max(1, Math.min(item.quantity + delta, item.product.stockQuantity)),
              }
            : item
        )
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product._id !== productId));
  };

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCompleteSale = async () => {
    setError("");
    setSubmitting(true);
    try {
      const sale = await salesApi.createSale({
        customerName: customerName || undefined,
        items: cart.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
      });
      setCompletedSale(sale);
      setCart([]);
      setCustomerName("");
      productsApi.getProducts().then(setProducts);
    } catch (err) {
      setError(err.response?.data?.message || "Sale failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (completedSale) {
    return <ReceiptView sale={completedSale} onNewSale={() => setCompletedSale(null)} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs tracking-widest text-amber-dark uppercase mb-1">
          Point of Sale
        </p>
        <h1 className="text-2xl font-semibold text-ink">New Sale</h1>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Product picker */}
        <div className="col-span-2 space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by name or SKU..."
              className="w-full border border-line rounded-sm pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-1">
            {filtered.map((p) => (
              <button
                key={p._id}
                onClick={() => p.stockQuantity > 0 && addToCart(p)}
                disabled={p.stockQuantity === 0}
                className="text-left bg-white border border-line rounded-sm p-3.5 hover:border-amber transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <p className="text-sm font-medium text-ink">{p.name}</p>
                <p className="text-xs font-mono text-ink/40 mt-0.5">{p.sku}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-mono text-sm font-semibold text-ink">
                    ₱{p.price.toLocaleString()}
                  </span>
                  <span className="text-xs font-mono text-ink/40">
                    {p.stockQuantity} {p.unit}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="bg-white border border-line rounded-sm p-5 flex flex-col h-fit sticky top-8">
          <h2 className="text-sm font-semibold text-ink mb-4">Current Sale</h2>

          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Customer name (optional)"
            className="w-full border border-line rounded-sm px-3 py-1.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber"
          />

          {cart.length === 0 ? (
            <p className="text-sm text-ink/40 font-mono py-6 text-center">Cart is empty</p>
          ) : (
            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item.product._id} className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{item.product.name}</p>
                    <p className="text-xs font-mono text-ink/40">
                      ₱{item.product.price} × {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQty(item.product._id, -1)}
                      className="p-1 text-ink/50 hover:bg-paper-dim rounded-sm"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-5 text-center text-xs font-mono">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.product._id, 1)}
                      className="p-1 text-ink/50 hover:bg-paper-dim rounded-sm"
                    >
                      <Plus size={12} />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="p-1 text-ink/40 hover:text-rust ml-1"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-line pt-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink">Total</span>
              <span className="font-mono text-lg font-semibold text-ink">
                ₱{total.toLocaleString()}
              </span>
            </div>
          </div>

          {error && (
            <p className="text-sm text-rust bg-rust/10 border border-rust/20 rounded-sm px-3 py-2 mb-3">
              {error}
            </p>
          )}

          <button
            onClick={handleCompleteSale}
            disabled={cart.length === 0 || submitting}
            className="w-full bg-amber text-ink rounded-sm py-2.5 text-sm font-semibold hover:bg-amber-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? "Processing..." : "Complete Sale"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ReceiptView({ sale, onNewSale }) {
  return (
    <div className="flex flex-col items-center py-10">
      <div className="receipt-edge bg-white w-full max-w-sm px-6 py-8 shadow-sm font-mono text-sm">
        <div className="text-center mb-4">
          <p className="font-semibold tracking-wide">SALES RECEIPT</p>
          <p className="text-xs text-ink/50 mt-1">
            {new Date(sale.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="border-t border-dashed border-line my-3" />
        <p className="text-xs text-ink/60 mb-2">Customer: {sale.customerName}</p>
        <div className="space-y-1.5 mb-3">
          {sale.items.map((item, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span className="truncate pr-2">
                {item.productName} × {item.quantity}
              </span>
              <span>₱{item.subtotal.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-dashed border-line my-3" />
        <div className="flex justify-between font-semibold">
          <span>TOTAL</span>
          <span>₱{sale.totalAmount.toLocaleString()}</span>
        </div>
        <div className="border-t border-dashed border-line my-3" />
        <p className="text-center text-xs text-ink/40">Thank you!</p>
      </div>

      <button
        onClick={onNewSale}
        className="mt-6 bg-ink text-paper px-5 py-2.5 rounded-sm text-sm font-medium hover:bg-ink-light transition-colors"
      >
        Start New Sale
      </button>
    </div>
  );
}
