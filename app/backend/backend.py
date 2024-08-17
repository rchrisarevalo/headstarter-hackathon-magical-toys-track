from fastapi import FastAPI, UploadFile, File
import whisper
import tortoise
import soundfile as sf
import tempfile
import os

app = FastAPI()

whisper_model = whisper.load_model("base")

@app.post("/recognize/") 
async def recognize(file: UploadFile = File(...)):
    # Save the uploaded audio file
    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        temp_file.write(await file.read())
        audio_path = temp_file.name

    # Recognize speech
    result = whisper_model.transcribe(audio_path)
    recognized_text = result['text'].strip().lower()
    
    # Handle command (basic command recognition)
    response_text = handle_command(recognized_text)
    
    # Respond with TTS
    tts = tortoise.tts
    audio_array = tts.tts(response_text)
    
    # Save and return the audio file
    try: 
        sf.write("response.wav", audio_array, 22050)
    except OSError as e:
        print(f"Error writing audio file: {e}")

    return {"recognized_text": recognized_text, "response_audio": "response.wav"}

def handle_command(command):
    responses = {
        "hello": "Hello! How can I assist you today?",
        "what is your name": "I am your AI assistant.",
        "goodbye": "Goodbye! Have a great day!"
    }
    return responses.get(command, "I didn't understand that. Can you please repeat?")
