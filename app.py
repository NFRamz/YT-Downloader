import os
import yt_dlp
from flask import Flask, render_template, request, send_from_directory

app = Flask(__name__)
DOWNLOAD_FOLDER = 'downloads'
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)
# Set lokasi FFmpeg yang terinstal di sistem Railway
os.environ["FFMPEG_LOCATION"] = "/usr/bin/ffmpeg"


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/download', methods=['POST'])
def download_youtube_video():
    url = request.form['url']
    
    try:
        ydl_opts = {
            'format': '140',
            'merge_output_format': 'mp3',
            'outtmpl': os.path.join(DOWNLOAD_FOLDER, '%(title)s.%(ext)s'),
            'quiet': True,
            'cookies': 'cookies.txt', 
            'ffmpeg_location': "/usr/bin/ffmpeg",
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',  # Konversi ke MP3
                'preferredquality': '192',  # Kualitas audio 192kbps
            }],
             
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(url, download=True)
            video_title = info_dict.get('title', 'Unknown Title')
            video_ext = info_dict.get('ext', 'mp4')

            # Setelah unduhan selesai, kirimkan file ke pengguna
            file_path = os.path.join(DOWNLOAD_FOLDER, f"{video_title}.{video_ext}")
            return send_from_directory(DOWNLOAD_FOLDER, f"{video_title}.{video_ext}", as_attachment=True)
    
    except Exception as e:
        return f"An error occurred: {e}"

if __name__ == '__main__':
    #app.run(debug=True)
    app.run(host='0.0.0.0', port=10000)
