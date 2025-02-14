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


// ✅ Port dari `.env` atau default 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
