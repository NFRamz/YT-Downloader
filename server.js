require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());


app.use(express.static(path.join(__dirname, 'public')));


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.get('/89asdsdasad89w02129pejdni10348k0mkg9pbmg8m42822fnnauf97ai91jmn2a8a2475nfo43pa9w719dnd86nq8weh67w7ber8jrji2nkqhg9e823j7hf8jendjhqkgedjr78drd8d9jqpourjndbumdadijubo1jnfi1kjf8rb181', (req, res) => {
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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});

