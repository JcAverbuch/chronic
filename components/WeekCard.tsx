"use client";
import type { Palette, TrainingWeek, WeekMode } from "@/lib/types";
import ModePill from "@/components/ModePill";

type Props = {
  week: TrainingWeek;
  activeMode: WeekMode;
  setMode: (weekNum: number, mode: WeekMode) => void;
  panelStyle: React.CSSProperties;
  palette: Palette;
};

export default function WeekCard({
  week,
  activeMode,
  setMode,
  panelStyle,
  palette,
}: Props) {
  const currentMode = week[activeMode];

  return (
    <div style={{ ...panelStyle, padding: 18, display: "grid", gap: 14 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ display: "grid", gap: 6 }}>
          <div style={{ color: palette.yellow, fontFamily: "'Press Start 2P', monospace", fontSize: 12 }}>
            WEEK {week.weekNum}
          </div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{week.phase}</div>
        </div>
        <div
          style={{
            padding: "8px 10px",
            borderRadius: 999,
            border: `2px solid ${week.isStepback ? palette.yellow : palette.purple}`,
            color: week.isStepback ? palette.yellow : palette.cyan,
            fontWeight: 800,
            fontSize: 12,
          }}
        >
          {week.isStepback ? "STEP-BACK WEEK" : "STAGE CLEARABLE"}
        </div>
      </div>

      <div style={{ display: "grid", gap: 10, color: palette.white, lineHeight: 1.6 }}>
        <div><strong style={{ color: palette.cyan }}>Main quest:</strong> {week.focus}</div>
        <div><strong style={{ color: palette.pink }}>Side quest:</strong> {week.sideQuest}</div>
        <div><strong style={{ color: palette.green }}>Key session:</strong> {week.keySession}</div>
        <div><strong style={{ color: palette.yellow }}>Coach note:</strong> {week.coachNote}</div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <ModePill
          label="GREEN"
          mode="green"
          weekNum={week.weekNum}
          color={palette.green}
          selected={activeMode === "green"}
          onClick={setMode}
          palette={palette}
        />
        <ModePill
          label="YELLOW"
          mode="yellow"
          weekNum={week.weekNum}
          color={palette.yellow}
          selected={activeMode === "yellow"}
          onClick={setMode}
          palette={palette}
        />
        <ModePill
          label="RED"
          mode="red"
          weekNum={week.weekNum}
          color={palette.red}
          selected={activeMode === "red"}
          onClick={setMode}
          palette={palette}
        />
      </div>

      <div
        style={{
          border: `2px solid ${currentMode.border}`,
          borderRadius: 8,
          padding: 14,
          background: "#0b0615",
          display: "grid",
          gap: 8,
        }}
      >
        <div style={{ color: currentMode.border, fontWeight: 800, fontSize: 12 }}>
          {currentMode.label}
        </div>
        <div style={{ color: palette.white, fontWeight: 700 }}>{currentMode.summary}</div>
        <div style={{ color: palette.white, fontSize: 14, lineHeight: 1.6 }}>
          {currentMode.text}
        </div>
      </div>
    </div>
  );
}