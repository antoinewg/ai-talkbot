"use client";

import { useChat } from "ai/react";
import { AudioPlayer } from "./components/audio-player";
import { AudioRecorder } from "./components/audio-recorder";
import { motion } from "framer-motion";

export default function Chat() {
  const { messages, input, setInput, append, handleInputChange, handleSubmit, isLoading } = useChat();
  const lastCompletedAssistantMessage = isLoading ? null : messages.filter((m) => m.role === "assistant").at(-1);

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch gap-2">
      {messages.map((m) => (
        <motion.div
          key={m.id}
          initial={{ opacity: 0, x: m.role === "user" ? 20 : -20, y: 10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`flex items-start gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`${
              m.role === "user" ? "bg-[#228BE6] text-white" : "bg-[#F1F3F5] text-[#1A1B1E]"
            } px-4 py-2 rounded-3xl max-w-[70%]`}
          >
            {m.content}
          </div>
        </motion.div>
      ))}

      {/* auto play the last message */}
      {lastCompletedAssistantMessage && <AudioPlayer text={lastCompletedAssistantMessage.content} />}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded-sm shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
      <AudioRecorder setInput={setInput} append={append} />
    </div>
  );
}
