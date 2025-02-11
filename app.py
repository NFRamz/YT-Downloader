import os
import requests
from flask import Flask, render_template, request, send_from_directory, jsonify

app = Flask(__name__)

DOWNLOAD_FOLDER = 'downloads'
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

API_URL = "https://api.ryzendesu.vip/api/downloader/ytmp3?url="

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/download', methods=['POST'])
def download_youtube_audio():
    video_url = request.form['url']
    
    try:
        # Request ke API
        response = requests.get(API_URL + video_url)
        data = response.json()

        if 'url' not in data or 'filename' not in data:
            return jsonify({"error": "Gagal mengambil data dari API"}), 500

        # Unduh file MP3 dari URL API
        mp3_url = data['url']
        filename = data['filename']
        file_path = os.path.join(DOWNLOAD_FOLDER, filename)

        # Download MP3 dan simpan ke folder
        with requests.get(mp3_url, stream=True) as r:
            r.raise_for_status()
            with open(file_path, 'wb') as f:
                for chunk in r.iter_content(chunk_size=8192):
                    f.write(chunk)

        return send_from_directory(DOWNLOAD_FOLDER, filename, as_attachment=True)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)
