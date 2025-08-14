import { auth, provider, signInWithPopup, onAuthStateChanged, signOut } from './firebase-init.js';

const mainNav = document.getElementById('main-nav');

onAuthStateChanged(auth, (user) => {
    if (!mainNav) return;

    let navContent = '';
    if (user) {
        navContent = `
            <a href="/" class="logo">Starluxx</a>
            <div class="nav-right" id="nav-menu">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/dashboard.html">Dashboard</a></li>
                </ul>
                <img src="${user.photoURL}" alt="${user.displayName}" class="user-avatar" title="${user.displayName}">
                <button id="logout-btn" class="btn">Logout</button>
            </div>
            <button class="hamburger" id="hamburger-btn"><span></span><span></span><span></span></button>
        `;
    } else {
        navContent = `
            <a href="/" class="logo">Starluxx</a>
            <div class="nav-right" id="nav-menu">
                <ul>
                    <li><a href="/">Home</a></li>
                </ul>
                <button id="login-btn" class="btn">Login with Google</button>
            </div>
            <button class="hamburger" id="hamburger-btn"><span></span><span></span><span></span></button>
        `;
    }
    mainNav.innerHTML = navContent;
    attachNavListeners();
});

function attachNavListeners() {
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            signInWithPopup(auth, provider)
                .then(() => { window.location.href = '/dashboard.html'; })
                .catch((error) => console.error("Login failed:", error));
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
