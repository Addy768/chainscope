import { useCallback, useRef, useState } from "react";

export default function Uploader({ onFile }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);

  const handle = useCallback(
    (f) => {
      if (!f) return;
      onFile(f);
    },
    [onFile]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        handle(e.dataTransfer.files?.[0]);
      }}
      onClick={() => inputRef.current?.click()}
      className={`cursor-pointer rounded-2xl border border-dashed p-10 text-center transition-colors ${
        drag ? "border-accent bg-panel" : "border-border bg-panel/60"
      }`}
    >
      <p className="text-ink">Drop an electronics photo here</p>
      <p className="mt-1 text-sm text-muted">or click to choose a file</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handle(e.target.files?.[0])}
      />
    </div>
  );
}
