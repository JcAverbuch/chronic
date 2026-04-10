"use client";
import { Palette, WeekMode } from "@/lib/types";

type Props = {
  label: string;
  mode: WeekMode;
  weekNum: number;
  color: string;
  selected: boolean;
  onClick: (weekNum: number, mode: WeekMode) => void;
  palette: Palette;
};

export default function ModePill({
  label,
  mode,
  weekNum,
  color,
  selected,
  onClick,
  palette,
}: Props) {
  return (
    <button
      onClick={() => onClick(weekNum, mode)}
      style={{
        padding: "8px 10px",
        borderRadius: 999,
        border: `2px solid ${selected ? color : palette.border}`,
        background: selected ? `${color}22` : "transparent",
        color: selected ? color : palette.muted,
        fontWeight: 800,
        fontSize: 12,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}