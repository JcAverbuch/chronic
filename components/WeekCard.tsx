"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import type { DayPlan, Palette, TrainingWeek, WeekMode } from "@/lib/types";
import ModePill from "@/components/ModePill";

type Props = {
  week: TrainingWeek;
  activeMode: WeekMode;
  setMode: (weekNum: number, mode: WeekMode) => void;
  panelStyle: CSSProperties;
  palette: Palette;
};

function getModeMeta(activeMode: WeekMode, palette: Palette) {
  if (activeMode === "green") {
    return {
      label: "GREEN MODE",
      color: palette.green,
      subtitle: "full intended week",
    };
  }

  if (activeMode === "yellow") {
    return {
      label: "YELLOW MODE",
      color: palette.yellow,
      subtitle: "keep structure, reduce load",
    };
  }

  return {
    label: "RED MODE",
    color: palette.red,
    subtitle: "gentle suggestions only",
  };
}

function categoryLabel(category: DayPlan["category"]) {
  if (category === "time_on_feet") return "TIME ON FEET";
  if (category === "quality") return "QUALITY";
  if (category === "strength") return "STRENGTH";
  if (category === "skills") return "SKILLS";
  if (category === "mobility") return "RECOVERY";
  if (category === "long") return "LONG";
  if (category === "rest") return "REST";
  return "EASY";
}

export default function WeekCard({
  week,
  activeMode,
  setMode,
  panelStyle,
  palette,
}: Props) {
  const [isOpen, setIsOpen] = useState(week.weekNum === 1);

  const currentMode = week[activeMode];
  const modeMeta = getModeMeta(activeMode, palette);

  return (
    <div style={{ ...panelStyle, padding: 18, display: "grid", gap: 14 }}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
          textAlign: "left",
        }}
      >
        <div style={{ display: "grid", gap: 6 }}>
          <div
            style={{
              color: palette.yellow,
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 12,
            }}
          >
            WEEK {week.weekNum}
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: palette.white }}>
            {week.phase}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
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

          <div
            style={{
              color: palette.muted,
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 14,
              minWidth: 16,
              textAlign: "center",
            }}
          >
            {isOpen ? "−" : "+"}
          </div>
        </div>
      </button>

      {isOpen ? (
        <>
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
              border: `2px solid ${modeMeta.color}`,
              borderRadius: 8,
              padding: 14,
              background: "#0b0615",
              display: "grid",
              gap: 6,
            }}
          >
            <div style={{ color: modeMeta.color, fontWeight: 800, fontSize: 12 }}>
              {modeMeta.label}
            </div>
            <div style={{ color: palette.white, fontWeight: 700 }}>{modeMeta.subtitle}</div>
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {currentMode.map((day) => (
              <div
                key={day.day}
                style={{
                  border: `2px solid ${palette.border}`,
                  borderRadius: 8,
                  padding: 12,
                  background: "#0b0615",
                  display: "grid",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      color: palette.cyan,
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 12,
                    }}
                  >
                    {day.day}
                  </div>

                  <div
                    style={{
                      padding: "4px 8px",
                      borderRadius: 999,
                      border: `1px solid ${palette.border}`,
                      color: palette.muted,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {categoryLabel(day.category)}
                  </div>
                </div>

                <div style={{ color: palette.white, fontSize: 18, fontWeight: 800 }}>
                  {day.title}
                </div>

                <div style={{ color: palette.white, lineHeight: 1.6 }}>{day.workout}</div>

                {day.zoneLabel ? (
                  <div style={{ color: palette.yellow, fontSize: 13 }}>
                    {day.zoneLabel} • {day.zonePercent}
                    {day.bpmRange ? ` (${day.bpmRange})` : ""}
                  </div>
                ) : null}

                {day.notes ? (
                  <div style={{ color: palette.muted, fontSize: 13, lineHeight: 1.5 }}>
                    {day.notes}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}