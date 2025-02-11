import os
import re
import requests

from flask import Flask, render_template, request, send_from_directory, jsonify

app = Flask(__name__)

DOWNLOAD_FOLDER = 'downloads'
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

API_URL = "https://api.ryzendesu.vip/api/downloader/ytmp3?url="

def download_file(url, filename):
    """Mengunduh file dari URL yang diberikan"""
    file_path = os.path.join(DOWNLOAD_FOLDER, filename)

    try:
        with requests.get(url, stream=True) as r:
            r.raise_for_status()  # Akan memicu error jika status bukan 200
            with open(file_path, 'wb') as f:
                for chunk in r.iter_content(chunk_size=8192):
                    f.write(chunk)
        return file_path
    except requests.HTTPError as err:
        return str(err)  # Mengembalikan pesan error HTTP jika terjadi masalah

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/download', methods=['POST'])
def download_youtube_audio():
    video_url = request.form['url']

    try:
        # Request ke API untuk mendapatkan link download
        response = requests.get(API_URL + video_url)
        data = response.json()

        if 'url' not in data or 'filename' not in data:
            return jsonify({"error": "Gagal mengambil data dari API"}), 500

        mp3_url = data['url']
        filename = data['filename']

        # Coba unduh file
        result = download_file(mp3_url, filename)

        # Jika hasil download adalah pesan error dan mengandung link baru
        if "403 Client Error" in result:
            print("Error 403 terjadi, mencoba mengambil link dari error message...")

            match = re.search(r'https:\/\/cobalt-api\.kwiatekmiki\.com\/tunnel\?id=[^"]+', result)
            if match:
                new_url = match.group(0)
                print(f"Link baru ditemukan: {new_url}")

                # Coba download ulang dari link baru
                result = download_file(new_url, filename)

                if "403 Client Error" in result:
                    return jsonify({"error": "Tetap gagal dengan error 403"}), 403
            else:
                return jsonify({"error": "Tidak dapat menemukan link dalam error"}), 403

        return send_from_directory(DOWNLOAD_FOLDER, filename, as_attachment=True)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)
