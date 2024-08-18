import whisper
import subprocess

model = whisper.load_model("base")

audio_file = "media/Recording.wav"

result = model.transcribe(audio_file)

phrase = "Test: Hello"
response = result['text']

subprocess.run(["node", "index.js", phrase, response])

print("Recognized text:", response)
