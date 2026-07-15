import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";

export default function Uploader({ onFile, preview }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        onFile(e.dataTransfer.files?.[0]);
      }}
      onClick={() => inputRef.current?.click()}
      className={`grad-border card-glow relative cursor-pointer overflow-hidden p-8 text-center transition-all ${
        drag ? "scale-[1.01] shadow-glowCyan" : ""
      }`}
    >
      <AnimatePresence mode="wait">
        {preview ? (
          <motion.img
            key="preview"
            src={preview}
            alt=""
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mx-auto max-h-64 rounded-lg"
          />
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 py-6"
          >
            <motion.div
              animate={{ y: drag ? -4 : 0 }}
              className="rounded-full bg-accent/10 p-4 text-accent shadow-glow animate-float"
            >
              <UploadCloud size={36} />
            </motion.div>
            <p className="text-lg font-medium">
              Drop an electronics photo here
            </p>
            <p className="flex items-center gap-1.5 text-sm text-muted">
              <ImageIcon size={14} /> or click to choose a file
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0])}
      />
    </motion.div>
  );
}
