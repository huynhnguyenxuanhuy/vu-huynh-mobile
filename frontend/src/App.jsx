import { useEffect, useState } from "react";
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

const API_BASE =
  import.meta.env.VITE_API_URL?.replace("/api", "") ||
  "https://vu-huynh-mobile-backend.onrender.com";

function App() {
  const [serverStatus, setServerStatus] = useState("checking");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    let retryTimeout;

    const wakeServer = async () => {
      try {
        const res = await fetch(API_BASE, {
          method: "GET",
          cache: "no-store",
        });

        if (!isMounted) return;

        if (res.ok) {
          setServerStatus("ready");
          return;
        }

        setServerStatus("waking");
        retryTimeout = setTimeout(() => {
          setRetryCount((prev) => prev + 1);
        }, 4000);
      } catch (error) {
        if (!isMounted) return;

        setServerStatus("waking");
        retryTimeout = setTimeout(() => {
          setRetryCount((prev) => prev + 1);
        }, 4000);
      }
    };

    wakeServer();

    return () => {
      isMounted = false;
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [retryCount]);

  if (serverStatus !== "ready") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #eef2ff 0%, #f8fafc 50%, #e0e7ff 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 560,
            background: "#ffffff",
            borderRadius: 28,
            padding: "40px 32px",
            boxShadow: "0 25px 60px rgba(15, 23, 42, 0.12)",
            border: "1px solid #e2e8f0",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 74,
              height: 74,
              margin: "0 auto 22px",
              borderRadius: "50%",
              border: "6px solid #e0e7ff",
              borderTop: "6px solid #4f46e5",
              animation: "spin 1s linear infinite",
            }}
          />

          <h1
            style={{
              margin: 0,
              fontSize: 32,
              fontWeight: 900,
              color: "#0f172a",
              marginBottom: 12,
            }}
          >
            HỆ THỐNG ĐANG KHỞI ĐỘNG
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: 16,
              lineHeight: 1.7,
              color: "#475569",
              marginBottom: 18,
            }}
          >
            Server đang được đánh thức để phục vụ bạn.
            <br />
            Vui lòng chờ một chút rồi web sẽ tự vào.
          </p>

          <div
            style={{
              display: "inline-block",
              padding: "10px 18px",
              borderRadius: 999,
              background: "#eef2ff",
              color: "#4338ca",
              fontWeight: 800,
              fontSize: 14,
              marginBottom: 18,
            }}
          >
            Trạng thái: {serverStatus === "checking" ? "Đang kiểm tra..." : "Đang khởi động server..."}
          </div>

          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "#64748b",
            }}
          >
            Nếu đây là lần mở đầu sau một thời gian không dùng, có thể mất khoảng 20–60 giây.
          </p>

          <style>
            {`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </div>
    );
  }

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