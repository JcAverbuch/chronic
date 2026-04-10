"use client";
import { Palette } from "@/lib/types";

type Props = {
  step: number;
  panelStyle: React.CSSProperties;
  palette: Palette;
  stageLabels: string[];
};

export default function StepHeader({ step, panelStyle, palette, stageLabels }: Props) {
  return (
    <div style={{ ...panelStyle, padding: 24, overflow: "hidden", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 4px)",
          opacity: 0.2,
          pointerEvents: "none",
        }}
      />
      <div style={{ display: "grid", gap: 16, position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "grid", gap: 10 }}>
            <div
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 28,
                lineHeight: 1.5,
                color: palette.pink,
                textShadow: `3px 3px 0 ${palette.purple}`,
              }}
            >
              FLARE FIGHTER
            </div>
            <div
              style={{
                color: palette.cyan,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 1,
                fontFamily: "'Press Start 2P', monospace",
              }}
            >
              For chronically ill type 2 fun fans
            </div>
            <div
              style={{
                color: palette.white,
                maxWidth: 760,
                lineHeight: 1.6,
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 8,
              }}
            >
              <i>if you don't laugh, you'll cry! </i>
            </div>
          </div>
          <div
            style={{
              alignSelf: "start",
              color: palette.yellow,
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 12,
            }}
          >
            {step === 0 ? "" : `STAGE ${step + 1}`}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {stageLabels.map((label, i) => (
            <div
              key={label}
              style={{
                padding: "10px 12px",
                borderRadius: 999,
                border: `2px solid ${step === i ? palette.yellow : palette.border}`,
                color: step === i ? palette.yellow : palette.muted,
                fontSize: 12,
                fontWeight: 800,
                background: step === i ? "rgba(255,228,94,0.1)" : "transparent",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}