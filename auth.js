const adminAuth = (req, res, next) => {
    // Ambil username & password dari Environment Variables di Vercel
    const user = process.env.ADMIN_USER;
    const pass = process.env.ADMIN_PASS;

    // Jika username atau password tidak diatur, lewati saja (untuk development lokal)
    if (!user || !pass) {
        console.warn("PERINGATAN: Username/Password Admin belum diatur. Halaman admin tidak diproteksi.");
        return next();
    }

    // Ambil header otorisasi dari request browser
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    // Periksa apakah username dan password cocok
    if (login && password && login === user && password === pass) {
        return next(); // Jika cocok, lanjutkan ke halaman yang diminta
    }

    // Jika tidak cocok, minta browser untuk menampilkan pop-up login
    res.set('WWW-Authenticate', 'Basic realm="Area Terbatas"');
    res.status(401).send('Autentikasi diperlukan untuk mengakses halaman ini.');
};

module.exports = adminAuth;
