require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// ✅ Melayani file statis (HTML, CSS, gambar, dll.)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Menyajikan halaman utama dari `public/index.html`
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Mengambil environment variables untuk API & Google Analytics ID
app.get('/.env', (req, res) => {
    res.json({
        YOUTUBE_MP3_API: process.env.YOUTUBE_MP3_API,
        YOUTUBE_MP4_API: process.env.YOUTUBE_MP4_API,
        FACEBOOK_API: process.env.FACEBOOK_API,
        INSTAGRAM_API: process.env.INSTAGRAM_API,
        TIKTOK_API: process.env.TIKTOK_API,
        SPOTIFY_API: process.env.SPOTIFY_API,
        TWITTER_API: process.env.TWITTER_API,
        GA_ID: process.env.GA_ID // Google Analytics ID
    });
});

app.use((req, res, next) => {
    if (req.path === '/.env') {
        return res.status(404).send('Not Found');
    }
    next();
});


// ✅ Port dari `.env` atau default 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
