import os
import yt_dlp
from flask import Flask, render_template, request, send_from_directory

app = Flask(__name__)

DOWNLOAD_FOLDER = 'downloads'
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/download', methods=['POST'])
def download_youtube_audio():
    url = request.form['url']
    
    try:
        ydl_opts = {
            'format': 'bestaudio/best',  # Pilih kualitas audio terbaik
            'outtmpl': os.path.join(DOWNLOAD_FOLDER, '%(title)s.%(ext)s'),
            'quiet': False,  # Tampilkan progress di terminal/log
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',  # Konversi ke MP3
                'preferredquality': '192',  # Kualitas 192kbps
            }],
            'cookiefile': '--cookies-from-browser chrome',  # Ambil cookies dari Chrome
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(url, download=True)
            video_title = info_dict.get('title', 'Unknown Title')

            # Pastikan file dikembalikan dalam format MP3
            file_path = os.path.join(DOWNLOAD_FOLDER, f"{video_title}.mp3")
            return send_from_directory(DOWNLOAD_FOLDER, f"{video_title}.mp3", as_attachment=True)

    except Exception as e:
        return f"An error occurred: {str(e)}"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)
