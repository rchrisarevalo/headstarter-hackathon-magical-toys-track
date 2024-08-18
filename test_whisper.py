import whisper
import subprocess
import sys
import os

try:
    model = whisper.load_model("base")

    audio_file = "./media/Recording.wav"

    if not os.path.exists(audio_file):
        print("The path does not exist")
        raise Exception
    else:
        print("The path does exist.")

    result = model.transcribe(audio_file)

    phrase = "Test: Hello"
    response = result['text']

    subprocess.run(["node", "index.js", phrase, response])

    print("Recognized text:", response)

except Exception as e:
    print(f"Error occurred at line {sys.exc_info()[-1].tb_lineno}: {e}")
