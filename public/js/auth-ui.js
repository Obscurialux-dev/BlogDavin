import { auth, provider, signInWithPopup, onAuthStateChanged, signOut } from './firebase-init.js';

const mainNav = document.getElementById('main-nav');

// Pantau perubahan status otentikasi
onAuthStateChanged(auth, (user) => {
    // Jika elemen navigasi tidak ditemukan, hentikan eksekusi
    if (!mainNav) return;

    let navContent = '';
    
    // Jika pengguna sudah login
    if (user) {
        navContent = `
            <a href="/" class="logo">Starluxx</a>
            <div class="nav-right" id="nav-menu">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/dashboard.html">Dashboard</a></li>
                </ul>
                <!-- DITAMBAHKAN: Kotak pencarian -->
                <input type="search" id="search-box" placeholder="Cari artikel..." class="search-box">
                
                <img src="${user.photoURL}" alt="${user.displayName}" class="user-avatar" title="${user.displayName}">
                <button id="logout-btn" class="btn">Logout</button>
            </div>
            <button class="hamburger" id="hamburger-btn"><span></span><span></span><span></span></button>
        `;
    } else { // Jika pengguna belum login
        navContent = `
            <a href="/" class="logo">Starluxx</a>
            <div class="nav-right" id="nav-menu">
                <ul>
                    <li><a href="/">Home</a></li>
                </ul>
                <!-- DITAMBAHKAN: Kotak pencarian -->
                <input type="search" id="search-box" placeholder="Cari artikel..." class="search-box">
                
                <button id="login-btn" class="btn">Login with Google</button>
            </div>
            <button class="hamburger" id="hamburger-btn"><span></span><span></span><span></span></button>
        `;
    }
    // Masukkan konten navigasi ke dalam elemen <nav>
    mainNav.innerHTML = navContent;
    // Pasang event listener untuk tombol-tombol di navigasi
    attachNavListeners();
});

// Fungsi untuk memasang event listener pada elemen navigasi
function attachNavListeners() {
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            signInWithPopup(auth, provider)
                .then(() => { window.location.href = '/dashboard.html'; })
                .catch((error) => console.error("Login gagal:", error));
        });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            signOut(auth).then(() => { window.location.href = '/'; });
        });
    }

    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => navMenu.classList.toggle('open'));
    }
}
