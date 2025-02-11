async function fetchData() {
    const platform = document.getElementById("platform").value;
    const videoUrl = document.getElementById("videoUrl").value;
    let apiUrl = "";

    if (platform === "youtube") {
        apiUrl = `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${videoUrl}`;
    } else if (platform === "facebook") {
        apiUrl = `https://api.ryzendesu.vip/api/downloader/fbdl?url=${videoUrl}`;
    } else if (platform === "tiktok") {
        apiUrl = `https://api.ryzendesu.vip/api/downloader/ttdl?url=${videoUrl}`;
    }

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        displayResult(data, platform);
    } catch (error) {
        document.getElementById("result").innerHTML = "Gagal mengambil data.";
    }
}

function displayResult(data, platform) {
    let resultHtml = "";

    if (platform === "youtube") {
        resultHtml = `
            <h3>${data.title}</h3>
            <img src="${data.thumbnail}" alt="Thumbnail" width="100%">
            //<p>Author: <a href="${data.authorUrl}" target="_blank">${data.author}</a></p>
            //<p>Views: ${data.views}</p>
            <a href="${data.url}" download>Download MP3</a>
            <a href="${data.videoUrl}" download>Download Video</a>
        `;
    } else if (platform === "facebook") {
        resultHtml = `
            <h3>${data.title}</h3>
            <img src="${data.thumbnail}" alt="Thumbnail" width="100%">
            <a href="${data.video}" download>Download Video</a>
        `;
    } else if (platform === "tiktok") {
        resultHtml = `
            <h3>${data.desc}</h3>
            <img src="${data.author.avatar_thumb.url_list[0]}" alt="Thumbnail" width="100%">
            <a href="${data.music.play_url.url_list[0]}" download>Download Video</a>
        `;
    }
    document.getElementById("result").innerHTML = resultHtml;
}
