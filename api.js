const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const upload = require('./upload');

const router = express.Router();
const dbPath = path.resolve(__dirname, './database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) { return console.error('Error saat koneksi ke DB:', err.message); }
  console.log('Berhasil terhubung ke database SQLite.');
  db.run(`CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, content TEXT NOT NULL,
      author TEXT, imageUrl TEXT, category TEXT, 
      userId TEXT, userEmail TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

router.post('/upload', upload.single('imageFile'), (req, res) => {
    if (!req.file) { return res.status(400).json({ error: 'Tidak ada file yang di-upload.' }); }
    res.json({ imageUrl: req.file.path });
});

router.get('/my-articles', (req, res) => {
    const userId = req.query.userId;
    if (!userId) { return res.status(400).json({ error: "User ID dibutuhkan" }); }

    const sql = "SELECT * FROM articles WHERE userId = ? ORDER BY createdAt DESC";
    db.all(sql, [userId], (err, rows) => {
        if (err) { return res.status(500).json({ "error": err.message }); }
        res.json({ "message": "success", "data": rows });
    });
});

router.get('/articles', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  const searchTerm = req.query.search || '';
  const category = req.query.category || '';
  let conditions = [], params = [];
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

router.get('/articles/count', (req, res) => {
    const searchTerm = req.query.search || '';
    const category = req.query.category || '';
    let conditions = [], params = [];
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

router.get('/categories', (req, res) => {
    const sql = "SELECT DISTINCT category FROM articles WHERE category IS NOT NULL AND category != '' ORDER BY category";
    db.all(sql, [], (err, rows) => {
        if (err) { return res.status(500).json({ "error": err.message }); }
        res.json({ "message": "success", "data": rows });
    });
});

router.get('/articles/:id', (req, res) => {
    const sql = "SELECT * FROM articles WHERE id = ?";
    db.get(sql, [req.params.id], (err, row) => {
        if (err) { return res.status(400).json({"error":err.message}); }
        res.json({ "message":"success", "data":row });
    });
});

router.post('/articles', (req, res) => {
    const { title, content, author, imageUrl, category, userId, userEmail } = req.body;
    if (!title || !content) { return res.status(400).json({"error": "Judul dan konten tidak boleh kosong"}); }
    const sql = 'INSERT INTO articles (title, content, author, imageUrl, category, userId, userEmail) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.run(sql, [title, content, author, imageUrl, category, userId, userEmail], function(err) {
        if (err) { return res.status(400).json({"error": err.message}); }
        res.json({ "message": "success", "data": { id: this.lastID } });
    });
});

router.put('/articles/:id', (req, res) => {
    const { title, content, author, imageUrl, category, userId } = req.body;
    if (!title || !content) { return res.status(400).json({"error": "Judul dan konten tidak boleh kosong"}); }
    const sql = `UPDATE articles SET title = ?, content = ?, author = ?, imageUrl = ?, category = ? WHERE id = ?`;
    db.run(sql, [title, content, author, imageUrl, category, req.params.id], function(err) {
        if (err) { return res.status(400).json({"error": err.message}); }
        res.json({ "message": "success", "changes": this.changes });
    });
});

router.delete('/articles/:id', (req, res) => {
    const sql = 'DELETE FROM articles WHERE id = ?';
    db.run(sql, [req.params.id], function(err) {
        if (err) { return res.status(400).json({"error": err.message}); }
        res.json({ "message": "deleted", "changes": this.changes });
    });
});

module.exports = router;
