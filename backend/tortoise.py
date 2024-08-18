import sys
sys.path.append("C:\\Users\\ruben\\anaconda3\\envs\\tortoise\\Lib\\site-packages")

from flask import Flask, request, jsonify
import tortoise

app = Flask(__name__)

@app.route('/generate-tts', methods=['POST'])
def generatetts():
    data = request.json
    text = data.get('text', '')

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    try:
        # Assuming you have initialized Tortoise TTS correctly
        tts = tortoise.TextToSpeech()  # Ensure this is correct based on the library's documentation
        wav_bytes = tts.speak(text)  # Example of generating TTS audio
        outputfile = 'output.wav'
        with open(outputfile, 'wb') as f:
            f.write(wav_bytes)

        return jsonify({'file': outputfile}), 200

    except Exception as e:
        print(e)
        return jsonify({'error': 'Failed to generate speech'}), 500

if __name__ == '__main__':
    app.run(port=5000, host='0.0.0.0', debug=True)
