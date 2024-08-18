"use client";
import { IoMic, IoMicOffSharp } from "react-icons/io5";
import { FormEvent, useEffect, useState } from "react";

export default function Home() {
  const [voiceChatOpen, setVoiceChatOpen] = useState<boolean>(false);

  const handleSubmission = async (e: FormEvent<HTMLFormElement>) => {
    // Set up logic to handle voice file submission or
    // audio submission that came from user's mic.
    e.preventDefault()
    console.log("Clicked!")

    const audio_file = (document.getElementById("audio-file")) as HTMLInputElement
    const form = new FormData()

    if (audio_file.files) {
      form.append('audio-file', audio_file.files[0])
    }

    try {
      const res = await fetch("http://localhost:8000/recognize", {
        method: 'POST',
        body: form
      })

      if (res.ok) {
        const data = await res.json()

        // Placeholder output for now.
        console.log(data)
      }
    
    } catch {
      throw new Error("Failed to upload an audio file")
    }
  };

  return (
    <main className="flex min-h-screen flex-col w-full items-center justify-evenly gap-5 p-24">
      <h1 className="text-4xl font-sans font-extrabold">
        Hugging Track Voice AI Application
      </h1>
      <form onSubmit={handleSubmission} className="flex flex-col gap-20 items-center justify-center">
        <span className="flex flex-row max-sm:flex-col items-center justify-center max-sm:gap-16 gap-32">
          <div className="flex flex-col items-center justify-center gap-5">
            <span className="p-28 rounded-full bg-white opacity-40 shadow-2xl shadow-blue-700"></span>
            <div className="flex flex-row gap-5 items-center justify-center">
              <button
                type="button"
                onClick={() => setVoiceChatOpen((prev) => !prev)}
                className="p-5 flex items-center rounded-full bg-white"
              >
                {voiceChatOpen ? (
                  <IoMic size={40} color={"black"} />
                ) : (
                  <IoMicOffSharp size={40} color={"black"} />
                )}
              </button>
              <label>
                <input type="file" accept="audio/wav" hidden id="audio-file"></input>
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
  );
}
