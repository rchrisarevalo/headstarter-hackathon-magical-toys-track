from flask import Flask, request, send_file
from tortoise.api import TextToSpeech

app = Flask(__name__)

@app.route('/generate-tts', methods=['POST'])
def generate_tts():
    text = request.json['text']
    tts = TextToSpeech()
    wav = tts.tts(text)
    wav.save("output.wav")
    return send_file("output.wav", mimetype="audio/wav")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
