import express from 'express';
import multer from 'multer';
import fs from 'fs';
import OpenAI from 'openai';
import axios from 'axios';
import Redis from 'redis';
import { MongoClient } from 'mongodb';

const app = express();
const port = process.env.PORT || 3001;
const redisClient = Redis.createClient();
const mongoClient = new MongoClient(process.env.MONGO_DB_URL || '', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function getTranscription(filePath: string): Promise<string> {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-1',
      language: 'en', 
    });

    console.log(transcription);
    return transcription.text;
  }

app.post('/api/voice-interaction', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');

  const fileBuffer = req.file.buffer;
  
  try {
    // 1. Speech-to-Text (Whisper)
    const whisperResponse = await axios.post('WHISPER_API_ENDPOINT', fileBuffer, {
      headers: { 'Content-Type': 'application/octet-stream' }
    });
    const text = whisperResponse.data.text;

    // 2. Text Processing (Llama)
    const llamaResponse = await axios.post('LLAMA_API_ENDPOINT', { text });
    const processedText = llamaResponse.data.text;

    // 3. Text-to-Speech (Tortoise)
    const ttsResponse = await axios.post('TORTOISE_API_ENDPOINT', { text: processedText });
    const audioUrl = ttsResponse.data.audioUrl;

    // 4. Save to MongoDB
    await mongoClient.connect();
    const db = mongoClient.db('voiceAI');
    await db.collection('interactions').insertOne({ text, response: processedText, audioUrl });

    res.json({ response: processedText, audioUrl });

  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).send('Error processing request.');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
