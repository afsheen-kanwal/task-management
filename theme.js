// theme.js - ye file <head> mein load hoti hai taake page khulte hi theme lag jaye (flash na ho)
var THEME_KEY = 'appTheme';

function getSavedTheme() {
    try {
        return localStorage.getItem(THEME_KEY) || 'default';
    } catch (e) {
        return 'default';
    }
}

function setTheme(name) {
    document.documentElement.setAttribute('data-theme', name);
    try { localStorage.setItem(THEME_KEY, name); } catch (e) {}

    document.querySelectorAll('[data-theme-btn]').forEach(function (btn) {
        const on = btn.dataset.themeBtn === name;
        btn.classList.toggle('active', on);
        btn.setAttribute('aria-pressed', on);
    });
}

// foran apply
document.documentElement.setAttribute('data-theme', getSavedTheme());

// buttons ko wire karo
window.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-theme-btn]').forEach(function (btn) {
        btn.addEventListener('click', function () { setTheme(btn.dataset.themeBtn); });
    });
    setTheme(getSavedTheme());
});