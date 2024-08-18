"use client";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string>("");
  const [voiceChatOpen, setVoiceChatOpen] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setAudioFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (audioFile) {
      const formData = new FormData();
      formData.append("file", audioFile);

      try {
        const res = await axios.post(
          "http://localhost:3001/api/voice-interaction",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setResponse(res.data.response);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <>
      {/* <div>
        <h1>Voice AI Interaction</h1>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleSubmit}>Submit</button>
        <p>Response: {response}</p>
      </div> */}

      <main className="flex min-h-screen flex-col w-full items-center justify-evenly gap-5 p-24">
        <h1 className="text-4xl font-sans font-extrabold">
          Hugging Track Voice AI Application
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-20 items-center justify-center"
        >
          <span className="flex flex-row max-sm:flex-col items-center justify-center max-sm:gap-16 gap-32">
            <div className="flex flex-col items-center justify-center gap-5">
              <span className="p-28 rounded-full bg-white opacity-40 shadow-2xl shadow-blue-700"></span>
              <div className="flex flex-row gap-5 items-center justify-center">
                <button
                  type="button"
                  onClick={() => setVoiceChatOpen((prev) => !prev)}
                  className="p-5 flex items-center rounded-full bg-white text-black font-bold"
                >
                  {voiceChatOpen ? (
                    <p>Use</p>
                  ) : (
                    <p>Mute</p>
                  )}
                </button>
                <label>
                  <input
                    type="file"
                    accept="audio/wav"
                    hidden
                    id="audio-file"
                    onChange={handleFileChange}
                  ></input>
                  <span className="p-5 pl-10 pr-10 max-sm:pl-5 max-sm:pr-5 bg-white cursor-pointer font-extrabold text-lg text-black rounded-xl">
                    Upload
                  </span>
                </label>
              </div>
            </div>
            <div className="flex flex-col items-center rounded-xl justify-center bg-white font-sans text-lg round-xl text-black">
              <textarea
                rows={10}
                cols={40}
                placeholder="Your audio description will go here"
                className="rounded-xl resize-none outline-none p-5"
                value={response}
                disabled
                required
              />
            </div>
          </span>
          <button
            type="submit"
            className="transition ease-in-out delay-75 bg-blue-800 w-full hover:bg-blue-950 text-white hover: font-bold text-lg p-6 pl-12 pr-12 rounded-lg"
          >
            Submit
          </button>
        </form>
      </main>
    </>
  );
}
