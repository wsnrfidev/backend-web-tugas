const db = require("../models/db");

exports.login = (req, res) => {
  const { phone, password } = req.body;

  const query = "SELECT * FROM users WHERE phone = ? AND password = ?";
  db.query(query, [phone, password], (err, results) => {
    if (err) return res.status(500).json({ message: "Error login" });

    if (results.length > 0) {
      const user = results[0];
      res.json({
        success: true,
        message: "Login berhasil",
        user: {
          phone: user.phone,
          name: user.name || "",
          photo: user.photo || "",
          role: user.role || "user",
        },
      });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Nomor HP atau password salah" });
    }
  });
};

exports.register = (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({
      success: false,
      message: "Nomor HP dan password wajib diisi.",
    });
  }

  db.query("SELECT * FROM users WHERE phone = ?", [phone], (err, results) => {
    if (err)
      return res.status(500).json({ success: false, message: "Server error" });

    if (results.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Nomor HP sudah terdaftar.",
      });
    }

    db.query(
      "INSERT INTO users (phone, password, role) VALUES (?, ?, ?)",
      [phone, password, "user"],
      (err) => {
        if (err)
          return res
            .status(500)
            .json({ success: false, message: "Server error saat register." });

        res.json({ success: true, message: "Registrasi berhasil." });
      }
    );
  });
};

exports.updateProfile = (req, res) => {
  const { phone, name, photo, oldPassword, newPassword } = req.body;

  if (!phone) {
    return res
      .status(400)
      .json({ success: false, message: "Nomor HP wajib dikirim." });
  }

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

  const updateData = () => {
    if (fields.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Tidak ada data untuk diperbarui." });
    }

    values.push(phone);
    const sql = `UPDATE users SET ${fields.join(", ")} WHERE phone = ?`;
    db.query(sql, values, (err) => {
      if (err) {
        console.error("Update error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Gagal update profil." });
      }

      res.json({ success: true, message: "Profil berhasil diperbarui." });
    });
  };

  if (newPassword) {
    if (!oldPassword) {
      return res.status(400).json({
        success: false,
        message: "Password lama wajib diisi untuk mengubah password.",
      });
    }

    db.query("SELECT * FROM users WHERE phone = ?", [phone], (err, results) => {
      if (err || results.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "User tidak ditemukan." });
      }

      const user = results[0];
      if (user.password !== oldPassword) {
        return res
          .status(401)
          .json({ success: false, message: "Password lama salah." });
      }

      fields.push("password = ?");
      values.push(newPassword);
      updateData();
    });
  } else {
    updateData();
  }
};
