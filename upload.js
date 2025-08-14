const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config(); // Memuat variabel dari file .env

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blog-pribadi', // Nama folder di Cloudinary
    format: async (req, file) => 'webp', // Format gambar modern
    public_id: (req, file) => 'artikel-' + Date.now(),
  },
});

const upload = multer({ storage: storage });
