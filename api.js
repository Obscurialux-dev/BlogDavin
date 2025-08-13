const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();
const dbPath = path.resolve(__dirname, './database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    return console.error('Error saat koneksi ke DB:', err.message);
  }
  console.log('Berhasil terhubung ke database SQLite.');
  db.run(`CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author TEXT DEFAULT 'Anonim',
      imageUrl TEXT,
      category TEXT, 
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// GET: Mengambil artikel DENGAN PAGINASI, PENCARIAN, & KATEGORI
router.get('/articles', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  const searchTerm = req.query.search || '';
  const category = req.query.category || '';

  let conditions = [];
  let params = [];

  if (searchTerm) {
      conditions.push("(title LIKE ? OR content LIKE ?)");
      params.push(`%${searchTerm}%`, `%${searchTerm}%`);
  }
  if (category) {
      conditions.push("category = ?");
      params.push(category);
  }

  let sql = "SELECT * FROM articles";
  if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
  }

  sql += " ORDER BY createdAt DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);

  db.all(sql, params, (err, rows) => {
    if (err) { return res.status(500).json({ "error": err.message }); }
    res.json({ "message": "success", "data": rows });
  });
});

// GET: Menghitung total artikel DENGAN PENCARIAN & KATEGORI
router.get('/articles/count', (req, res) => {
    const searchTerm = req.query.search || '';
    const category = req.query.category || '';

    let conditions = [];
    let params = [];

    if (searchTerm) {
        conditions.push("(title LIKE ? OR content LIKE ?)");
        params.push(`%${searchTerm}%`, `%${searchTerm}%`);
    }
    if (category) {
        conditions.push("category = ?");
        params.push(category);
    }

    let sql = "SELECT COUNT(*) as count FROM articles";
    if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
    }

    db.get(sql, params, (err, row) => {
        if (err) { return res.status(500).json({ "error": err.message }); }
        res.json({ "message": "success", "data": row });
    });
});

// GET: Mengambil daftar kategori unik (BARU)
router.get('/categories', (req, res) => {
    const sql = "SELECT DISTINCT category FROM articles WHERE category IS NOT NULL AND category != '' ORDER BY category";
    db.all(sql, [], (err, rows) => {
        if (err) { return res.status(500).json({ "error": err.message }); }
        res.json({ "message": "success", "data": rows });
    });
});

// GET: Mengambil satu artikel berdasarkan ID
router.get('/articles/:id', (req, res) => {
    const sql = "SELECT * FROM articles WHERE id = ?";
    db.get(sql, [req.params.id], (err, row) => {
        if (err) { return res.status(400).json({"error":err.message}); }
        res.json({ "message":"success", "data":row });
    });
});

// POST: Membuat artikel baru
router.post('/articles', (req, res) => {
    const { title, content, author, imageUrl, category } = req.body;
    if (!title || !content) { return res.status(400).json({"error": "Judul dan konten tidak boleh kosong"}); }
    const sql = 'INSERT INTO articles (title, content, author, imageUrl, category) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [title, content, author, imageUrl, category], function(err) {
        if (err) { return res.status(400).json({"error": err.message}); }
        res.json({ "message": "success", "data": { id: this.lastID } });
    });
});

// PUT: Mengupdate artikel berdasarkan ID
router.put('/articles/:id', (req, res) => {
    const { title, content, author, imageUrl, category } = req.body;
    if (!title || !content) { return res.status(400).json({"error": "Judul dan konten tidak boleh kosong"}); }
    const sql = `UPDATE articles SET title = ?, content = ?, author = ?, imageUrl = ?, category = ? WHERE id = ?`;
    db.run(sql, [title, content, author, imageUrl, category, req.params.id], function(err) {
        if (err) { return res.status(400).json({"error": err.message}); }
        res.json({ "message": "success", "changes": this.changes });
    });
});

// DELETE: Menghapus artikel berdasarkan ID
router.delete('/articles/:id', (req, res) => {
    const sql = 'DELETE FROM articles WHERE id = ?';
    db.run(sql, [req.params.id], function(err) {
        if (err) { return res.status(400).json({"error": err.message}); }
        res.json({ "message": "deleted", "changes": this.changes });
    });
});

module.exports = router;
