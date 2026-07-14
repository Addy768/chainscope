import { useEffect, useRef } from "react";

export default function ComponentOverlay({ imageUrl, boxes }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!imageUrl) return;
    const img = new Image();
    img.onload = () => {
      const c = canvasRef.current;
      if (!c) return;
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0);
      ctx.font = "16px monospace";
      ctx.lineWidth = 2;
      (boxes || []).forEach((b) => {
        const [x1, y1, x2, y2] = b.bbox;
        ctx.strokeStyle = "#7c5cff";
        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
        ctx.fillStyle = "#7c5cff";
        ctx.fillRect(x1, y1 - 20, ctx.measureText(b.label).width + 12, 20);
        ctx.fillStyle = "#0b0f14";
        ctx.fillText(b.label, x1 + 6, y1 - 6);
      });
    };
    img.src = imageUrl;
  }, [imageUrl, boxes]);

  return (
    <div className="rounded-2xl border border-border bg-panel p-2">
      <canvas ref={canvasRef} className="w-full rounded-lg" />
    </div>
  );
}
