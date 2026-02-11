// KONFIGURASI: Ganti ke URL API langsung
// Jika masih terkena CORS Error, gunakan proxy publik seperti: "https://corsproxy.io/?" atau "https://api.allorigins.win/raw?url="
const CORS_PROXY = ""; // Biarkan kosong jika ingin direct hit, isi jika butuh bypass CORS
const API_BASE = "https://api.ryzumi.vip/api/downloader";

detectInput();

async function fetchData() {
    const platform = document.getElementById("platform").value;
    const videoUrl = document.getElementById("videoUrl").value;
    let apiUrl = "";
    let apiUrl1 = ""; // Khusus Youtube (MP4)

    if(!videoUrl){
        document.getElementById("result").innerHTML = `
        <h3>Harap masukkan link video.</h3>
        `;
        return;
    }

    loadLoader();
    
    // MENENTUKAN URL API LANGSUNG (Hardcoded)
    if (platform === "youtube") {
        apiUrl = `${API_BASE}/ytmp3?url=${videoUrl}`;
        apiUrl1 = `${API_BASE}/ytmp4?url=${videoUrl}`;

    } else if (platform === "facebook") {
        apiUrl = `${API_BASE}/facebook?url=${videoUrl}`;

    } else if (platform === "instagram"){
        apiUrl = `${API_BASE}/ig?url=${videoUrl}`;

    } else if (platform === "tiktok") {
        apiUrl = `${API_BASE}/tiktok?url=${videoUrl}`;

    } else if (platform === "spotify"){
        apiUrl = `${API_BASE}/spotify?url=${videoUrl}`;

    } else if (platform === "twitter"){
        apiUrl = `${API_BASE}/twitter?url=${videoUrl}`;
    }

    // Tambahkan Proxy jika diset
    if (CORS_PROXY) {
        apiUrl = CORS_PROXY + encodeURIComponent(apiUrl);
        if(apiUrl1) apiUrl1 = CORS_PROXY + encodeURIComponent(apiUrl1);
    }

    try {
        if(platform === "youtube"){
            // Fetch langsung ke Ryzumi
            const response = await fetch(apiUrl);
            const response1 = await fetch(apiUrl1);
            
            if (!response.ok || !response1.ok) {
                console.error(`Gagal mengambil data! Status: ${response.status}`);
                throw new Error("Gagal mengambil data.");
            }

            const data = await response.json();
            const data1 = await response1.json();
            displayResultForYoutube(data, data1, platform);

        } else {
            // Fetch langsung ke Ryzumi
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                console.error(`Gagal mengambil data! Status: ${response.status}`);
                throw new Error("Gagal mengambil data.");
            }

            const data = await response.json();
            displayResult(data, platform);
        }
        
    } catch (error) {
        console.error("Fetch Error:", error);
        
        let errorMsg = "Terjadi kesalahan saat memproses permintaan Anda.";
        
        // Deteksi error CORS atau Network
        if (error.message.includes("Failed to fetch") || error.name === "TypeError") {
            errorMsg = "Gagal menghubungi server (CORS Blocked). API menolak akses langsung dari browser.";
        }

        document.getElementById("result").innerHTML =  `
            <h3>${errorMsg}</h3>
            <p>Cobalah link cadangan di bawah:</p>
            <a href="https://yt.savetube.me/1kejjj1?id=361901348" target="_blank">Link cadangan</a>
            `;
    }
}

//FUNCTION DISPLAY RESULT
function displayResult(data, platform) {
    let resultHtml = "";

    // Validasi data kosong
    if (!data) {
        document.getElementById("result").innerHTML = "<h3>Data tidak ditemukan atau API Error.</h3>";
        return;
    }

    if (platform === "facebook") {
        // Cek struktur data FB (terkadang berbeda tergantung response API)
        if(data.data && data.data.length > 0) {
            resultHtml=`
            <img src="${data.data[0].thumbnail}" alt="Thumbnail" width="100%"></img>
            <h3>Pilih Kualitas Video</h3>
            `;
            
            for(i = 0; i < data.data.length;i++){
                resultHtml += ` 
                <a href="${data.data[i].url}">Kualitas ${data.data[i].resolution}</a>
                `;
            }
        } else {
            resultHtml = "<h3>Video Facebook tidak ditemukan / Private.</h3>";
        }

    } else if(platform === "instagram"){
        if (data.data && Array.isArray(data.data)) {
            for(i = 0; i < data.data.length;i++){
                resultHtml += ` 
                <img src="${data.data[i].thumbnail}" alt="Thumbnail" width="100%"></img>
                <a href="${data.data[i].url}" download>Download Post</a>
                `;
            }
        } else {
            resultHtml = "<h3>Post Instagram tidak ditemukan.</h3>";
        }

    } else if (platform === "tiktok") {
        if (data.data && data.data.data) { // Sesuaikan dengan struktur JSON Ryzumi
            resultHtml=`
            <img src="${data.data.data.origin_cover}" alt="Thumbnail" width="100%"></img>
            
            <h3>Download Audio</h3>
            <a href="${data.data.data.music}" download="videoNo_WM.mp3">Mp3</a>

            <h3>Download Video(Mp4)</h3>
            <a href="${data.data.data.play}" download="videoNo_WM.mp4">Tanpa Watermark</a>
            <a href="${data.data.data.hdplay}" download="videoNo_WM_HD.mp4">Tanpa Watermark(HD)</a>
            <a href="${data.data.data.wmplay}" download="videoWM.mp4">Dengan Watermark</a>
            `;  
        } else {
             resultHtml = "<h3>Video TikTok tidak ditemukan.</h3>";
        }
        
    } else if(platform === "spotify"){
        if(data.success && data.metadata){
            resultHtml=`
            <img src="${data.metadata.cover}" alt="Thumbnail" width="100%"></img>
            <h5>Author:${data.metadata.artists}</h5>
            <h3>${data.metadata.title}</h3>

            <a href="${data.link}" download>Download Music</a>
            `;
        }else{
            resultHtml=`
            <h3>Lagu tidak ditemukan atau link salah.</h3>
            `;
        }

    } else if(platform === "twitter"){
        if(data.status && data.media){
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
            <h3>Gagal mengambil data Twitter.</h3>
            `;
        }
    }
    document.getElementById("result").innerHTML = resultHtml;
}


function displayResultForYoutube(data,data1,platform){
    let resultHtmlForYoutube = "";
    if (platform === "youtube") {
        // Fallback jika salah satu request gagal tapi yang lain berhasil
        const thumb = (data && data.thumbnail) ? data.thumbnail : (data1 && data1.thumbnail) ? data1.thumbnail : "";
        const title = (data && data.title) ? data.title : (data1 && data1.title) ? data1.title : "Video Youtube";
        
        const mp3Url = (data && data.url) ? data.url : "#";
        const mp4Url = (data1 && data1.url) ? data1.url : "#";

        if (mp3Url === "#" && mp4Url === "#") {
            resultHtmlForYoutube = "<h3>Gagal mendapatkan link download Youtube.</h3>";
        } else {
            resultHtmlForYoutube = `
                <img src="${thumb}" alt="Thumbnail" width="100%">
                <h3>${title}</h3>

                <a href="${mp3Url}" download target="_blank">Download Mp3</a>
                <a href="${mp4Url}" download target="_blank">Download Mp4 (360p)</a>
            `;
        }
    }
    document.getElementById("result").innerHTML = resultHtmlForYoutube;
}


//LOADER FUNCTION
function loadLoader() {
    document.getElementById("result").innerHTML = `
    <!-- LOADER -->
    <div class="loader">
    <h3 id="loadingText">Memproses permintaan</h3> 
        <div aria-label="Orange and tan hamster running in a metal wheel" role="img" class="wheel-and-hamster">
            <div class="wheel"></div>
            <div class="hamster">
                <div class="hamster__body">
                    <div class="hamster__head">
                        <div class="hamster__ear"></div>
                        <div class="hamster__eye"></div>
                        <div class="hamster__nose"></div>
                    </div>
                    <div class="hamster__limb hamster__limb--fr"></div>
                    <div class="hamster__limb hamster__limb--fl"></div>
                    <div class="hamster__limb hamster__limb--br"></div>
                    <div class="hamster__limb hamster__limb--bl"></div>
                    <div class="hamster__tail"></div>
                </div>
            </div>
            <div class="spoke"></div>
        </div>
    </div>
    `;

    // Panggil elemen setelah HTML telah diubah
    let count = 0;
    const textElement = document.getElementById("loadingText");

    // Interval animasi text
    const intervalId = setInterval(() => {
        const el = document.getElementById("loadingText");
        if(el) {
            count = (count + 1) % 4;  // Loop dari 0 ke 3
            el.innerText = "Memproses permintaan" + ".".repeat(count);
        } else {
            clearInterval(intervalId); // Hentikan jika elemen hilang
        }
    }, 500); 
}

//FUNCTION AUTOMATIC DETECT INPUT FOR CHANGE SELECT OPTION
function detectInput(){
    const videoInput = document.getElementById("videoUrl");
    if(videoInput){
        videoInput.addEventListener("input", function () {
            let url = this.value.toLowerCase();
            let platformSelect = document.getElementById("platform");

            if (url.includes("youtube") || url.includes("youtu.be")) {
                platformSelect.value = "youtube";
            } else if (url.includes("facebook") || url.includes("fb.watch")) {
                platformSelect.value = "facebook";
            } else if (url.includes("instagram") || url.includes("ig")) {
                platformSelect.value = "instagram";
            } else if (url.includes("tiktok")) {
                platformSelect.value = "tiktok";
            } else if (url.includes("twitter") || url.includes("x.com")) {
                platformSelect.value = "twitter";
            } else if (url.includes("spotify") || url.includes("spotify.com")) {
                platformSelect.value = "spotify";
            }
        });
    }
}
