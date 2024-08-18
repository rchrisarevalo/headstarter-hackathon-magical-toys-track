import sys
sys.path.append("C:\\Users\\ruben\\anaconda3\\envs\\tortoise\\Lib\\site-packages")
print(sys.path)

from flask import Flask, request, send_file
import tortoise

app = Flask(__name__)

@app.route('/generate-tts', methods=['POST'])
def generate_tts():
    text = request.json['text']
    print("Here is text:", text)
    tts = tortoise.tts
    wav = tts.tts(text)
    wav.save("output.wav")
    return send_file("output.wav", mimetype="audio/wav")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
