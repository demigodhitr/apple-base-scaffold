import { useRef } from "react";
import { useThreeScene } from "@/three/useThreeScene";
import { useTheme } from "@/hooks/useTheme";

/** Fixed full-screen WebGL backdrop. Purely decorative — all content lives in the DOM. */
export const Scene = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const { failed } = useThreeScene(canvasRef, theme === "dark");

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 ab-grain"
      aria-hidden="true"
      data-testid="three-canvas-wrapper"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 78% 6%, var(--ab-bg) 0%, var(--ab-bg-deep) 62%, var(--ab-bg-deep) 100%)",
        }}
      />
      {failed ? (
        <div className="absolute inset-0 grid place-items-center">
          <div
            className="ab-float h-[38vmin] w-[38vmin] rounded-full blur-2xl"
            style={{
              background:
                "conic-gradient(from 210deg, var(--ab-blue), transparent 40%, var(--ab-ember), transparent 75%, var(--ab-blue))",
              opacity: 0.35,
            }}
          />
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          data-testid="three-canvas"
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(97deg, var(--ab-scrim-1) 0%, var(--ab-scrim-2) 32%, transparent 64%)",
        }}
      />
    </div>
  );
};
