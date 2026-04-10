"use client";
import { Adventure, Palette } from "@/lib/types";

type Props = {
  type: Adventure;
  accent: string;
  active: boolean;
  onClick: (type: Adventure) => void;
  panelStyle: React.CSSProperties;
  pixelShadow: string;
  palette: Palette;
};

export default function AdventureCard({
  type,
  accent,
  active,
  onClick,
  panelStyle,
  pixelShadow,
  palette,
}: Props) {
  return (
    <button
      onClick={() => onClick(type)}
      style={{
        ...panelStyle,
        textAlign: "left",
        padding: 14,
        cursor: "pointer",
        borderColor: active ? accent : palette.border,
        boxShadow: active
          ? `0 0 0 2px ${accent}, 0 0 0 4px #000, 0 0 26px ${accent}66`
          : pixelShadow,
        display: "grid",
        gap: 12,
        background: active
          ? `linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.15)), linear-gradient(180deg, ${palette.panel2}, ${palette.panel})`
          : `linear-gradient(180deg, ${palette.panel2}, ${palette.panel})`,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1 / 1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, rgba(136,86,255,0.18), rgba(0,0,0,0.4))",
          border: `4px solid ${active ? accent : palette.border}`,
          borderRadius: 10,
          overflow: "hidden",
          boxShadow: active
            ? `inset 0 0 24px ${accent}22`
            : "inset 0 0 18px rgba(255,255,255,0.05)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(to bottom, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 2px, transparent 2px, transparent 4px)",
            opacity: 0.18,
            pointerEvents: "none",
          }}
        />
        <img
          src={type === "mountain" ? "/mountain.png" : "/run.png"}
          alt={type === "mountain" ? "Mountain plan portrait" : "Ultra plan portrait"}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            imageRendering: "pixelated",
            display: "block",
            padding: 12,
            filter: active ? "drop-shadow(0 0 12px rgba(255,255,255,0.18))" : "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            padding: "6px 8px",
            border: `2px solid ${active ? accent : palette.border}`,
            background: "rgba(8,3,18,0.84)",
            color: active ? accent : palette.muted,
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 10,
            lineHeight: 1.4,
          }}
        >
          {type === "mountain" ? "P1" : "P2"}
        </div>
        {active ? (
          <div
            style={{
              position: "absolute",
              bottom: 12,
              right: 12,
              padding: "6px 8px",
              border: `2px solid ${accent}`,
              background: "rgba(8,3,18,0.84)",
              color: accent,
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 10,
            }}
          >
            READY
          </div>
        ) : null}
      </div>

      <div
        style={{
          color: accent,
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 18,
          lineHeight: 1.5,
          textAlign: "center",
          paddingTop: 4,
        }}
      >
        {type === "mountain" ? "Mountain Plan" : "Ultra Plan"}
      </div>
    </button>
  );
}