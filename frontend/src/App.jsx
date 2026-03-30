import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ContactButtons from "./components/ContactButtons";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import Orders from "./pages/Orders";

import Dashboard from "./pages/Admin/Dashboard";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<Orders />} />

        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />
      </Routes>

      <ContactButtons />
    </>
  );
}

export default App;