export function AudioPlayer({ text }: { text: string }) {
  return (
    <audio autoPlay controls className="hidden">
      <source src={`/api/tts?text=${encodeURIComponent(text)}`} type="audio/mp3" />
      Your browser does not support the audio element.
      <track src={text} kind="captions" srcLang="en" label="English" />
    </audio>
  );
}
