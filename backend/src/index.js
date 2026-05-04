require("dotenv").config();
const authRoutes = require('./routes/auth');
const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use('/api/auth', authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "NK-Aroma API is running 🌿" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});