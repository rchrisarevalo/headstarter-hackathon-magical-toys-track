"use client";
import { IoMic, IoMicOffSharp } from "react-icons/io5";
import { useEffect, useState } from "react";

export default function Home() {
  const [voiceChatOpen, setVoiceChatOpen] = useState<boolean>(false);

  const handleSubmission = () => {
    // Set up logic to handle voice file submission or
    // audio submission that came from user's mic.
    // * LOGIC HERE *
  };

  return (
    <main className="flex min-h-screen flex-col w-full items-center justify-evenly gap-5 p-24">
      <h1 className="text-4xl font-sans font-semibold">Voice AI Application</h1>
      <div className="p-28 rounded-full bg-white"></div>
      <div className="flex flex-row gap-20 items-center justify-center">
        <button
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
          <input type="file" accept="audio/wav" hidden></input>
          <span className="p-5 pl-10 pr-10 max-sm:pl-5 max-sm:pr-5 bg-white cursor-pointer font-extrabold text-lg text-black rounded-xl">
            Upload
          </span>
        </label>
      </div>
      <div className="flex flex-col items-center rounded-xl justify-center bg-white font-sans text-lg round-xl text-black">
        <textarea rows={8} cols={40} className="rounded-xl resize-none outline-none p-5" />
      </div>
    </main>
  );
}
