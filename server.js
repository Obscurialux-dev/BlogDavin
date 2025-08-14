require('dotenv').config(); // Pindahkan ke baris paling atas
const express = require('express');
const path = require('path');
const cors = require('cors');
const apiRoutes = require('./api');
const adminAuth = require('./auth');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/admin.html', adminAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});
app.get('/edit.html', adminAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'edit.html'));
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
