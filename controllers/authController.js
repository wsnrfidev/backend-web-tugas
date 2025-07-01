const db = require("../models/db");

exports.login = (req, res) => {
  const { phone, password } = req.body;

  const query = "SELECT * FROM users WHERE phone = ? AND password = ?";
  db.query(query, [phone, password], (err, results) => {
    if (err) return res.status(500).json({ message: "Error login" });

    if (results.length > 0) {
      res.json({ success: true, message: "Login success", user: results[0] });
    } else {
      res.status(401).json({ success: false, message: "Login failed" });
    }
  });
};
