# AI talkbot

## Demo

https://github.com/user-attachments/assets/d9dac7a6-371b-449f-8cd4-a1ecef537b44

If you want to test it live, you'll have to clone the repo because I didn't set up the api keys for the public demo.

## Architecture

![architecture](https://github.com/user-attachments/assets/16bbb82e-3f0f-4e47-bf17-c71145529f97)<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1106.0765563852765 813.449077960383" width="2212.153112770553" height="1626.898155920766"><!-- svg-source:excalidraw --><metadata></metadata><defs>

Might seem more complex (and it is) but now you have a Talkbot instead of a Chatbot 🎉.

## Notes

Why not [OpenAI's realtime](https://platform.openai.com/docs/guides/realtime) ?
> Loosing realtime but gaining control over the AI agent (currently just a chatbot but picture it with tools).

Why ElevenLabs for Text-to-Speech and Deepgram for Speech to Text ? Because they're fast and good enough.

## Getting Started

First, copy paste the `.env.example` into a `.env.local` and provide the API keys.
Then, install `pnpm i` and run the development server `pnpm dev`.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Reference

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
