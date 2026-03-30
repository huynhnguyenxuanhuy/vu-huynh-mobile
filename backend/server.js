const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Product = require("./models/Product");

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:5177",
  "http://localhost:5178",
  "http://localhost:5179",
  "http://localhost:5180",
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.get("/", (req, res) => {
  res.send("VU HUYNH MOBILE API running...");
});

const seedProducts = async () => {
  try {
    const count = await Product.countDocuments();

    if (count === 0) {
      await Product.insertMany([
        {
          name: "iPhone 15 Pro Max",
          price: 29990000,
          image:
            "https://images.unsplash.com/photo-1695636953873-8db5f5e71fd6?q=80&w=1200&auto=format&fit=crop",
          description: "Flagship cao cấp của Apple, camera đẹp, hiệu năng mạnh.",
          brand: "Apple",
          countInStock: 10,
        },
        {
          name: "Samsung Galaxy S24 Ultra",
          price: 26990000,
          image:
            "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1200&auto=format&fit=crop",
          description: "Màn hình đẹp, pin trâu, chụp ảnh tốt.",
          brand: "Samsung",
          countInStock: 8,
        },
        {
          name: "Xiaomi 14",
          price: 17990000,
          image:
            "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=1200&auto=format&fit=crop",
          description: "Cấu hình ngon, giá hợp lý.",
          brand: "Xiaomi",
          countInStock: 12,
        },
      ]);

      console.log("Seeded default products");
    }
  } catch (error) {
    console.error("Seed products error:", error);
  }
};

seedProducts();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});