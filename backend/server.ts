import express from 'express';
import multer from 'multer';
import fs from 'fs';
import OpenAI from 'openai';
import axios from 'axios';
import Groq from 'groq-sdk';
import Redis from 'redis';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import path from 'path';
import os from 'os';
import * as dotenv from 'dotenv';

const app = express();

dotenv.config({ path: '.env.local' })

const port = process.env.PORT || 3001;
// const redisClient = Redis.createClient();
const mongoClient = new MongoClient(process.env.MONGO_DB_URL || '');

// redisClient.on('error', (err) => console.error('Redis client error', err));
// redisClient.connect().catch(console.error);

mongoClient.connect().then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

const storage = multer.memoryStorage();
const upload = multer({ storage });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function getTranscription(filePath: string): Promise<string> {
    console.log("Inside transcription!")
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-1',
      language: 'en', 
    });

    console.log(transcription);
    return transcription.text;
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY});

async function getGroqChatCompletion(text: string) {
    return groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: text,
        },
      ],
      model: 'llama3-8b-8192', 
    });
}

async function processText(text: string): Promise<string> {
    try {
      const chatCompletion = await getGroqChatCompletion(text);

      const responseText = chatCompletion.choices[0]?.message?.content || '';
      console.log(responseText)
      return responseText;
  
    } catch (error : unknown) {
        if (error instanceof Error) {
            console.error('Error processing text with Groq API:', error.message);
            throw new Error('Failed to process text');
    } else {
        console.error('An unknown error occurred while processing text');
        throw new Error('Unknown error');
    }
}
}

async function getResponseAudio(text: string): Promise<string> {
  try{
      const response = await axios.post('http://localhost:5000/generate-tts', { text }, {
      responseType: 'arraybuffer',
      });
  
      const audioFilePath = path.join(os.tmpdir(), 'output.wav');
      fs.writeFileSync(audioFilePath, response.data);
      return audioFilePath;
  } catch (error : unknown) {
    if (error instanceof Error) {
        console.error('Error calling TTS service:', error.message);
        throw new Error('Failed to generate speech');
    } else {
        console.error('An unknown error occurred while generating speech');
        throw new Error('Unknown error');
    }
  }
}


app.get("/", async (req, res) => {
  res.status(200).send({"message": "Hello world!"})
})

app.post('/api/voice-interaction', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');
  
  try {
    const fileBuffer = req.file.buffer;

    //save uploaded file temporarily
    const tempFilePath = path.join(os.tmpdir(), 'uploaded_audio.m4a');
    fs.writeFileSync(tempFilePath, fileBuffer);

    // stt w/ whisper ai
    const stt_text = await getTranscription(tempFilePath)

    // llama text response generation
    const response_text = await processText(stt_text)

    // // tts w/ tortoise tts
    // const tts_audio_url = await getResponseAudio(response_text)

    // save to mongo
    await mongoClient.connect();
    const db = mongoClient.db('voiceAI');
    await db.collection('interactions').insertOne({ stt_text, response: response_text });

    // res.json({ response: response_text });

    fs.unlinkSync(tempFilePath);
    // fs.unlinkSync(tts_audio_url);

    console.log("About to approach response send.")

    res.status(200).json({ response: response_text })

  } catch (error) {
    console.log(error)
    console.error('Error processing request:', error);
    res.status(500).send('Error processing request.');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
