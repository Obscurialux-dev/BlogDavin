const express = require('express');
const path = require('path');
const cors = require('cors');
const apiRoutes = require('./api');
const adminAuth = require('./auth'); // <-- Impor middleware auth

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Rute yang diproteksi
// Setiap kali ada yang akses /admin.html atau /edit.html, fungsi adminAuth akan dijalankan dulu
app.get('/admin.html', adminAuth);
app.get('/edit.html', adminAuth);

// Menyajikan semua file dari folder 'public'
app.use(express.static('public'));

// Rute API
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});