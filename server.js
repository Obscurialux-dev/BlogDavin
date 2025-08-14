require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const apiRoutes = require('./api');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', apiRoutes);

// Fallback untuk semua halaman HTML agar bisa di-refresh
app.get('*', (req, res) => {
  const file = path.join(__dirname, 'public', req.path.endsWith('.html') ? req.path : `${req.path.slice(1)}.html`);
  res.sendFile(file, (err) => {
    if (err) {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});