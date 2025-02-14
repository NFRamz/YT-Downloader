async function fetchData() {
    const platform = document.getElementById("platform").value;
    const videoUrl = document.getElementById("videoUrl").value;
    let apiUrl = "";

    if (platform === "youtube") {
        apiUrl = `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${videoUrl}`;
        //apiUrl = `https://apidl.asepharyana.cloud/api/downloader/ytmp3?url=${videoUrl}`;
    } else if (platform === "facebook") {
        apiUrl = `https://api.ryzendesu.vip/api/downloader/fbdl?url=${videoUrl}`;
    } else if (platform === "tiktok") {
        apiUrl = `https://api.ryzendesu.vip/api/downloader/ttdl?url=${videoUrl}`;
    }

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            console.error(`Gagal mengambil data! Status: ${response.status} - ${response.statusText}`);
            throw new Error("Error.");
        }

        const data = await response.json();
        displayResult(data, platform);

    } catch (error) {
        document.getElementById("result").innerHTML =  `
            <h3>Terjadi kesalahan saat memproses permintaan Anda.</h3>
            <a href="https://yt.savetube.me/1kejjj1?id=361901348">Link cadangan</a>
            `;

    }
}

function displayResult(data, platform) {
    let resultHtml = "";

    if (platform === "youtube") {
                
            resultHtml = `
                <img src="${data.thumbnail}" alt="Thumbnail" width="100%">
                <h3>${data.title}</h3>

                
                <a href="${data.url}" download>Download MP3</a>
                
            `;
    } else if (platform === "facebook" ) {
        resultHtml=`
        <img src="${data.data[0].thumbnail}" alt="Thumbnail" width="100%"></img>
        <h3>Pilih Kualitas Video</h3>
        `;
        
        for(i = 0; i < data.data.length;i++){
            resultHtml += ` 
            <a href="${data.data[i].url}">Kualitas ${data.data[i].resolution}</a>
            `;
        }


    } else if (platform === "tiktok") {
        resultHtml=`
        <img src="${data.data.data.origin_cover}" alt="Thumbnail" width="100%"></img>
        
        <h3>Download Audio</h3>
        <a href="${data.data.data.music}" download="videoNo_WM.mp4">Mp3</a>

        <h3>Download Video(Mp4)</h3>
        <a href="${data.data.data.play}" download="videoNo_WM.mp4">Tanpa Watermark</a>
        <a href="${data.data.data.hdplay}" download="videoNo_WM_HD.mp4">Tanpa Watermark(HD)</a>
        <a href="${data.data.data.wmplay}" download="videoWM.mp4">Dengan Watermark</a>
        
        `;  
        
    }
    document.getElementById("result").innerHTML = resultHtml;
}

