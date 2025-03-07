"use client";

import { useEffect, useRef } from "react";
import {
  SOCKET_STATES,
  type LiveTranscriptionEvent,
  LiveTranscriptionEvents,
  useDeepgram,
} from "../context/DeepgramContextProvider";
import { MicrophoneEvents, MicrophoneState, useMicrophone } from "../context/MicrophoneContextProvider";
import { Visualizer } from "./visualizer";
import type { useChat } from "ai/react";

type Props = Pick<ReturnType<typeof useChat>, "append" | "setInput">;

export const AudioRecorder = ({ setInput, append }: Props) => {
  const { connection, connectToDeepgram, socketState } = useDeepgram();
  const { setupMicrophone, microphone, startMicrophone, microphoneState } = useMicrophone();
  const captionTimeout = useRef<NodeJS.Timeout | null>(null);
  const keepAliveInterval = useRef<NodeJS.Timeout | null>(null);
  const partialResults = useRef<string[]>([]);

  const setPartialInput = (msg: string) => setInput(msg);
  const sendMessage = (msg: string) => {
    append({ role: "user", content: msg });
    setInput("");
  };

  useEffect(() => {
    setupMicrophone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (microphoneState === MicrophoneState.Ready) {
      connectToDeepgram({ model: "nova-3", endpointing: 500 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microphoneState]);

  useEffect(() => {
    if (!microphone) return;
    if (!connection) return;

    const onData = (e: BlobEvent) => {
      // iOS SAFARI FIX:
      // Prevent packetZero from being sent. If sent at size 0, the connection will close.
      if (e.data.size > 0) {
        connection?.send(e.data);
      }
    };

    const onTranscript = (data: LiveTranscriptionEvent) => {
      const { is_final: isFinal, speech_final: speechFinal } = data;
      const transcript = data.channel.alternatives[0].transcript;
      if (!isFinal) return;

      if (transcript !== "") {
        partialResults.current.push(transcript);
        const msg = partialResults.current.join(" ");
        if (msg !== "") setPartialInput(msg);
      }

      if (speechFinal) {
        const msg = partialResults.current.join(" ");
        if (msg !== "") sendMessage(msg);
        partialResults.current = [];
      }
    };

    if (socketState === SOCKET_STATES.open) {
      connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.addEventListener(MicrophoneEvents.DataAvailable, onData);

      startMicrophone();
    }

    return () => {
      // prettier-ignore
      connection.removeListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.removeEventListener(MicrophoneEvents.DataAvailable, onData);
      if (captionTimeout.current) {
        clearTimeout(captionTimeout.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketState]);

  useEffect(() => {
    if (!connection) return;

    if (microphoneState !== MicrophoneState.Open && socketState === SOCKET_STATES.open) {
      connection.keepAlive();

      keepAliveInterval.current = setInterval(() => {
        connection.keepAlive();
      }, 10000);
    } else {
      if (keepAliveInterval.current) {
        clearInterval(keepAliveInterval.current);
      }
    }

    return () => {
      if (keepAliveInterval.current) {
        clearInterval(keepAliveInterval.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microphoneState, socketState]);

  return <>{microphone && <Visualizer microphone={microphone} />}</>;
};
