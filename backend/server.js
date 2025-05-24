const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Creează sau deschide baza de date
const db = new sqlite3.Database("./backend/database.db");

// Creează tabela de contacte dacă nu există
db.run(`
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    phone TEXT
  )
`);

// GET: toate contactele
app.get("/contacts", (req, res) => {
  db.all("SELECT * FROM contacts", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST: adaugă contact
app.post("/contacts", (req, res) => {
  const { name, email, phone } = req.body;
  db.run("INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)", [name, email, phone], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, email, phone });
  });
});

// DELETE: șterge contact
app.delete("/contacts/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM contacts WHERE id = ?", id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Pornirea serverului
app.listen(port, () => {
  console.log(` Server pornit la http://localhost:${port}`);
});
