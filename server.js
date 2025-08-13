// File ini sudah diperbaiki untuk Vercel
const express = require('express');
const path = require('path');
const cors = require('cors');
const apiRoutes = require('./api');
const adminAuth = require('./auth');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Rute yang diproteksi
app.get('/admin.html', adminAuth);
app.get('/edit.html', adminAuth);

// Menyajikan semua file dari folder 'public'
app.use(express.static('public'));

// Rute API
app.use('/api', apiRoutes);

// Rute untuk halaman utama (PENTING UNTUK VERCEL)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});