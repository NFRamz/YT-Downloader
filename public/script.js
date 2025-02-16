
let ENV = {}; 


async function loadEnv() {
    const response = await fetch("/89asdsdasad89w02129pejdni10348k0mkg9pbmg8m42822fnnauf97ai91jmn2a8a2475nfo43pa9w719dnd86nq8weh67w7ber8jrji2nkqhg9e823j7hf8jendjhqkgedjr78drd8d9jqpourjndbumdadijubo1jnfi1kjf8rb181");
    ENV = await response.json();
}

loadEnv();
detectInput();
async function fetchData() {
    const platform = document.getElementById("platform").value;
    const videoUrl = document.getElementById("videoUrl").value;
    let apiUrl = "";
    let apiUrl1 = "";

    if(!videoUrl){
        document.getElementById("result").innerHTML = `
        <h3>Harap masukkan link video.</h3>
        `;
    }

    loadLoader();
    
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
            
        if (!response.ok || !response1.ok) {
            console.error(`Gagal mengambil data!(Err:RespYT) Status: ${response.status} - ${response.statusText}`);
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

//FUNCTION
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

    setInterval(() => {
        count = (count + 1) % 4;  // Loop dari 0 ke 3
        textElement.innerText = "Memproses permintaan" + ".".repeat(count);
    }, 500); // Ubah setiap 500ms
}

//FUNCTION AUTOMATIC DETECT INPUT FOR CHANGE SELECT OPTION
function detectInput(){
document.getElementById("videoUrl").addEventListener("input", function () {
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
