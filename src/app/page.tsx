'use client';

import { useChat } from 'ai/react';
import { AudioPlayer } from './components/audio-player';
import { AudioRecorder } from './components/audio-recorder';

export default function Chat() {
  const { messages, input, setInput, append, handleInputChange, handleSubmit, isLoading } = useChat();
  const lastCompletedAssistantMessage = isLoading ? null : messages.filter(m => m.role === 'assistant').at(-1)

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}

      {/* auto play the last message */}
      {lastCompletedAssistantMessage && <AudioPlayer text={lastCompletedAssistantMessage.content} />  }

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