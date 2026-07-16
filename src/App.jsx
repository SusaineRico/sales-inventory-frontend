import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import SalesHistory from "./pages/SalesHistory";

function withLayout(page) {
  return (
    <ProtectedRoute>
      <Layout>{page}</Layout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={withLayout(<Dashboard />)} />
          <Route path="/products" element={withLayout(<Products />)} />
          <Route path="/pos" element={withLayout(<Sales />)} />
          <Route path="/history" element={withLayout(<SalesHistory />)} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
