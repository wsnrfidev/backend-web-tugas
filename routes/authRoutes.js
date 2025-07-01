const express = require("express");
const router = express.Router();
const db = require("../models/db");


router.post("/register", async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({
      success: false,
      message: "Nomor HP dan password wajib diisi.",
    });
  }

  try {
    const [existing] = await db
      .promise()
      .query("SELECT * FROM users WHERE phone = ?", [phone]);

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Nomor HP sudah terdaftar.",
      });
    }

   
    await db
      .promise()
      .query("INSERT INTO users (phone, password, role) VALUES (?, ?, ?)", [
        phone,
        password,
        "user",
      ]);

    res.json({ success: true, message: "Registrasi berhasil." });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({
      success: false,
      message: "Nomor HP dan password wajib diisi.",
    });
  }

  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM users WHERE phone = ? AND password = ?", [phone, password]);

    if (rows.length > 0) {
      const user = rows[0];
      res.json({
        success: true,
        message: "Login berhasil.",
        user: {
          phone: user.phone,
          name: user.name || "",
          photo: user.photo || "",
          role: user.role || "user", 
        },
      });
    } else {
      res.status(401).json({ success: false, message: "Nomor HP atau password salah." });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
});


router.put("/update-profile", async (req, res) => {
  const { phone, name, photo, oldPassword, newPassword } = req.body;

  if (!phone) {
    return res.status(400).json({
      success: false,
      message: "Nomor HP wajib dikirim.",
    });
  }

  try {
    const fields = [];
    const values = [];

    if (name) {
      fields.push("name = ?");
      values.push(name);
    }

    if (photo) {
      fields.push("photo = ?");
      values.push(photo);
    }

    if (newPassword) {
      if (!oldPassword) {
        return res.status(400).json({
          success: false,
          message: "Password lama wajib diisi untuk mengubah password.",
        });
      }

      const [rows] = await db
        .promise()
        .query("SELECT * FROM users WHERE phone = ?", [phone]);

      if (!rows.length || rows[0].password !== oldPassword) {
        return res.status(401).json({
          success: false,
          message: "Password lama salah.",
        });
      }

      fields.push("password = ?");
      values.push(newPassword);
    }

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Tidak ada data untuk diperbarui.",
      });
    }

    values.push(phone);

    const sql = `UPDATE users SET ${fields.join(", ")} WHERE phone = ?`;
    await db.promise().query(sql, values);

    res.json({ success: true, message: "Profil berhasil diperbarui." });
  } catch (err) {
    console.error("Update profile error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error saat update." });
  }
});

module.exports = router;
