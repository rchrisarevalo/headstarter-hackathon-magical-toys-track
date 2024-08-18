"use client"
import Image from "next/image";
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setAudioFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (audioFile) {
      const formData = new FormData();
      formData.append('file', audioFile);

      try {
        const res = await axios.post('http://localhost:3001/api/voice-interaction', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setResponse(res.data.response);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
<div>
      <h1>Voice AI Interaction</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Submit</button>
      <p>Response: {response}</p>
    </div>
  );
}
