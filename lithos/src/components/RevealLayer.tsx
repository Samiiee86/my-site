import { useEffect, useRef } from "react";
import { MEDIA_SHIFT_PCT, SPOTLIGHT_R } from "../constants";

type RevealLayerProps = {
  video: string;
  cursorX: number;
  cursorY: number;
};

export default function RevealLayer({
  video,
  cursorX,
  cursorY,
}: RevealLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revealRef = useRef<HTMLVideoElement>(null);

  // Keep the offscreen canvas the size of the viewport.
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Repaint the soft spotlight and hand it to the reveal layer as a mask.
  useEffect(() => {
    const canvas = canvasRef.current;
    const reveal = revealRef.current;
    if (!canvas || !reveal) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // The video sits MEDIA_SHIFT_PCT lower than the viewport, so draw the
    // spotlight that much higher in the mask to keep it under the cursor.
    const shift = (canvas.height * MEDIA_SHIFT_PCT) / 100;
    const x = cursorX;
    const y = cursorY - shift;

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, SPOTLIGHT_R);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.4, "rgba(255,255,255,1)");
    gradient.addColorStop(0.6, "rgba(255,255,255,0.75)");
    gradient.addColorStop(0.75, "rgba(255,255,255,0.4)");
    gradient.addColorStop(0.88, "rgba(255,255,255,0.12)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fill();

    const mask = `url(${canvas.toDataURL()})`;
    reveal.style.setProperty("mask-image", mask);
    reveal.style.setProperty("-webkit-mask-image", mask);
    reveal.style.setProperty("mask-size", "100% 100%");
    reveal.style.setProperty("-webkit-mask-size", "100% 100%");
    reveal.style.setProperty("mask-repeat", "no-repeat");
    reveal.style.setProperty("-webkit-mask-repeat", "no-repeat");
  });

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ display: "none" }}
      />
      <video
        ref={revealRef}
        src={video}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-30 pointer-events-none translate-y-[20%]"
      />
    </>
  );
}
