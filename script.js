let ENV = {}; 


async function loadEnv() {
    const response = await fetch("/.env"); // Ambil dari server Node.js
    ENV = await response.json();
}
loadEnv();

async function fetchData() {
    const platform = document.getElementById("platform").value;
    const videoUrl = document.getElementById("videoUrl").value;
    let apiUrl = "";
    let apiUrl1 = "";
    if (platform === "youtube") {
        apiUrl = `${ENV.YOUTUBE_MP3_API}?url=${videoUrl}`;
        apiUrl1 = `${ENV.YOUTUBE_MP4_API}?url=${videoUrl}`;

    } else if (platform === "facebook") {
        apiUrl = `${ENV.FACEBOOK_API}?url=${videoUrl}`;

    }else if (platform === "instagram"){
        apiUrl = `${ENV.INSTAGRAM_API}?url=${videoUrl}`;

    }else if (platform === "tiktok") {
        apiUrl = `${ENV.TIKTOK_API}?url=${videoUrl}`;

    }else if (platform === "spotify"){
        apiUrl = `${ENV.SPOTIFY_API}?url=${videoUrl}`;

    }else if (platform === "twitter"){
        apiUrl = `${ENV.TWITTER_API}?url=${videoUrl}`;
    }

    try {
        if(platform === "youtube"){
            const response = await fetch(apiUrl);
            const response1 = await fetch(apiUrl1);
            
        if (!response.ok) {
            console.error(`Gagal mengambil data!(Err:Resp0) Status: ${response.status} - ${response.statusText}`);
            throw new Error("Error.");
        }

        if (!response1.ok) {
            console.error(`Gagal mengambil data!(Err:Resp1) Status: ${response.status} - ${response.statusText}`);
            throw new Error("Error.");
        }

        const data = await response.json();
        const data1 = await response1.json();
        displayResultForYoutube(data,data1, platform);

        }else{
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                console.error(`Gagal mengambil data! Status: ${response.status} - ${response.statusText}`);
                throw new Error("Error.");
            }

            const data = await response.json();
            displayResult(data, platform);
        }
        
    } catch (error) {
        document.getElementById("result").innerHTML =  `
            <h3>Terjadi kesalahan saat memproses permintaan Anda.</h3>
            <a href="https://yt.savetube.me/1kejjj1?id=361901348">Link cadangan</a>
            `;

    }
}

async function loadGtag() {
    try {
        // Ambil Google Analytics ID dari server
        const response = await fetch('/env');
        const env = await response.json();
        const GA_ID = env.GA_ID;

        if (GA_ID) {
            // Tambahkan script gtag.js ke dalam <head>
            const script = document.createElement('script');
            script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
            script.async = true;
            document.head.appendChild(script);

            // Inisialisasi Google Analytics
            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', GA_ID);
            
            console.log("✅ Google Analytics Loaded:", GA_ID);
        } else {
            console.warn("⚠️ GA_ID tidak ditemukan!");
        }
    } catch (error) {
        console.error("❌ Error loading GA ID:", error);
    }
}

loadGtag();



function displayResult(data, platform) {
    let resultHtml = "";

    if (platform === "facebook" ) {
        resultHtml=`
        <img src="${data.data[0].thumbnail}" alt="Thumbnail" width="100%"></img>
        <h3>Pilih Kualitas Video</h3>
        `;
        
        for(i = 0; i < data.data.length;i++){
            resultHtml += ` 
            <a href="${data.data[i].url}">Kualitas ${data.data[i].resolution}</a>
            `;
        }

    }else if(platform === "instagram"){
        for(i = 0; i < data.data.length;i++){
            resultHtml += ` 
            <img src="${data.data[i].thumbnail}" alt="Thumbnail" width="100%"></img>
            <a href="${data.data[i].url}" download>Download Post</a>
            `;
        }
        

    }else if (platform === "tiktok") {
        resultHtml=`
        <img src="${data.data.data.origin_cover}" alt="Thumbnail" width="100%"></img>
        
        <h3>Download Audio</h3>
        <a href="${data.data.data.music}" download="videoNo_WM.mp4">Mp3</a>

        <h3>Download Video(Mp4)</h3>
        <a href="${data.data.data.play}" download="videoNo_WM.mp4">Tanpa Watermark</a>
        <a href="${data.data.data.hdplay}" download="videoNo_WM_HD.mp4">Tanpa Watermark(HD)</a>
        <a href="${data.data.data.wmplay}" download="videoWM.mp4">Dengan Watermark</a>
        
        `;  
        
    }else if(platform === "spotify"){
        if(data.success){
            resultHtml=`
            <img src="${data.metadata.cover}" alt="Thumbnail" width="100%"></img>
            <h5>Author:${data.metadata.artists}</h5>
            <h3>${data.metadata.title}</h3>

            <a href="${data.link}" download>Download Music</a>
            `;
        }else{
            resultHtml=`
            <h3>Harap berikan link track music</h3>
            `;
        }

    }else if(platform === "twitter"){
        if(data.status){
            if(data.type === "image"){
                resultHtml=`
                <h3>Format file:.jpg</h3>
                `;
                for(i = 0; i < data.media.length;i++){
                    resultHtml += ` 
                    <a href="${data.media[i]}" download>Download Gambar</a>
                    `;
                }
            }else{
                resultHtml=`
                <h3>Format file: .mp4</h3>
                `;
                for(i = 0; i < data.media.length;i++){
                    resultHtml += ` 
                    <h3>Resolusi: ${data.media[i].quality}</h3>
                    <a href="${data.media[i].url}" download>Download Video</a>
                    `;
                }
            }
        }else{
            resultHtml=`
            <h3>(Error:Resp_X)</h3>
            `;
        }
    }
    document.getElementById("result").innerHTML = resultHtml;
}

function displayResultForYoutube(data,data1,platform){
    let resultHtmlForYoutube = "";
    if (platform === "youtube") {
                
        resultHtmlForYoutube = `
            <img src="${data.thumbnail}" alt="Thumbnail" width="100%">
            <h3>${data.title}</h3>

            
            <a href="${data.url}" download>Download Mp3</a>
            <a href="${data1.url}" download>Download Mp4 (360p)</a>
            
        `;
    }
    document.getElementById("result").innerHTML = resultHtmlForYoutube;
}
