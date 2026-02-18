// === Language Toggle ===
let currentLang = 'ko';
const langBtn = document.getElementById('lang-btn');

langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'ko' ? 'en' : 'ko';
    langBtn.textContent = currentLang === 'ko' ? 'EN' : 'KO';
    document.documentElement.lang = currentLang;

    document.querySelectorAll('[data-ko][data-en]').forEach(el => {
        const text = el.getAttribute('data-' + currentLang);
        if (el.id === 'track-title' && typeof currentTrack !== 'undefined' && currentTrack !== -1) return;
        el.textContent = text;
    });
});

// === Mobile Menu ===
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

// Close menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
    });
});

// === Gallery Lightbox ===
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const galleryCards = document.querySelectorAll('.gallery-card');

let currentImageIndex = 0;
const images = [];

galleryCards.forEach((card, index) => {
    const img = card.querySelector('.card-image img');
    const title = card.querySelector('.card-info h3').textContent;
    images.push({ src: img.src, title: title, hasError: card.querySelector('.card-image').classList.contains('placeholder') });

    card.addEventListener('click', () => {
        if (images[index].hasError) return;
        currentImageIndex = index;
        openLightbox(index);
    });
});

function openLightbox(index) {
    lightboxImg.src = images[index].src;
    lightboxCaption.textContent = images[index].title;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

document.querySelector('.lightbox-prev').addEventListener('click', (e) => {
    e.stopPropagation();
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    while (images[currentImageIndex].hasError && currentImageIndex > 0) {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    }
    openLightbox(currentImageIndex);
});

document.querySelector('.lightbox-next').addEventListener('click', (e) => {
    e.stopPropagation();
    currentImageIndex = (currentImageIndex + 1) % images.length;
    while (images[currentImageIndex].hasError && currentImageIndex < images.length - 1) {
        currentImageIndex = (currentImageIndex + 1) % images.length;
    }
    openLightbox(currentImageIndex);
});

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') document.querySelector('.lightbox-prev').click();
    if (e.key === 'ArrowRight') document.querySelector('.lightbox-next').click();
});

// === Music Player ===
const audio = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.querySelector('.progress-bar');
const progressCurrent = document.getElementById('progress-current');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const playlistItems = document.querySelectorAll('.playlist-item');

let currentTrack = -1;
let isPlaying = false;

function loadTrack(index) {
    const item = playlistItems[index];
    const src = item.getAttribute('data-src');
    const name = item.querySelector('.track-name').textContent;

    audio.src = src;
    trackTitle.textContent = name;
    trackArtist.textContent = 'Leia';
    currentTrack = index;

    playlistItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
}

function togglePlay() {
    if (currentTrack === -1) {
        loadTrack(0);
    }

    if (isPlaying) {
        audio.pause();
        playBtn.innerHTML = '&#9654;';
        isPlaying = false;
    } else {
        audio.play().catch(() => {});
        playBtn.innerHTML = '&#10074;&#10074;';
        isPlaying = true;
    }
}

playBtn.addEventListener('click', togglePlay);

prevBtn.addEventListener('click', () => {
    const newIndex = currentTrack <= 0 ? playlistItems.length - 1 : currentTrack - 1;
    loadTrack(newIndex);
    if (isPlaying) {
        audio.play().catch(() => {});
    }
});

nextBtn.addEventListener('click', () => {
    const newIndex = currentTrack >= playlistItems.length - 1 ? 0 : currentTrack + 1;
    loadTrack(newIndex);
    if (isPlaying) {
        audio.play().catch(() => {});
    }
});

playlistItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        loadTrack(index);
        audio.play().catch(() => {});
        playBtn.innerHTML = '&#10074;&#10074;';
        isPlaying = true;
    });
});

// Progress bar update
audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressCurrent.style.width = percent + '%';
        currentTimeEl.textContent = formatTime(audio.currentTime);
        totalTimeEl.textContent = formatTime(audio.duration);
    }
});

// Click on progress bar to seek
progressBar.addEventListener('click', (e) => {
    if (audio.duration) {
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percent * audio.duration;
    }
});

// Auto play next track
audio.addEventListener('ended', () => {
    const newIndex = currentTrack >= playlistItems.length - 1 ? 0 : currentTrack + 1;
    loadTrack(newIndex);
    audio.play().catch(() => {});
});

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

// === Navbar scroll effect ===
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 2px 20px rgba(140, 180, 220, 0.15)';
    } else {
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// === Scroll Animation ===
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.gallery-card, .music-player, .about-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
