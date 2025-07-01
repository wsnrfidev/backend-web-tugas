const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const db = require("./models/db"); 

// Routes
const authRoutes = require("./routes/authRoutes");
const peopleRoutes = require("./routes/peopleRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/people", peopleRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan." });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("API Working");
});