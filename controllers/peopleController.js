const db = require("../models/db");

exports.getAllPeople = (req, res) => {
  db.query("SELECT * FROM people", (err, results) => {
    if (err) return res.status(500).json({ error: "Gagal ambil data" });
    res.json(results);
  });
};

exports.addPerson = (req, res) => {
  const { name, age, phone, address, occupation } = req.body;
  const query = "INSERT INTO people (name, age, phone, address, occupation) VALUES (?, ?, ?, ?, ?)";
  db.query(query, [name, age, phone, address, occupation], (err) => {
    if (err) return res.status(500).json({ error: "Gagal tambah data" });
    res.json({ message: "Data berhasil ditambahkan" });
  });
};

exports.updatePerson = (req, res) => {
  const { id } = req.params;
  const { name, age, phone, address, occupation } = req.body;
  const query = "UPDATE people SET name=?, age=?, phone=?, address=?, occupation=? WHERE id=?";
  db.query(query, [name, age, phone, address, occupation, id], (err) => {
    if (err) return res.status(500).json({ error: "Gagal update data" });
    res.json({ message: "Data berhasil diupdate" });
  });
};

exports.deletePerson = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM people WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json({ error: "Gagal hapus data" });
    res.json({ message: "Data berhasil dihapus" });
  });
};
