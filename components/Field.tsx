"use client";
import type { ReactNode } from "react";
import type { Palette } from "@/lib/types";

type Props = {
  label: string;
  children: ReactNode;
  hint?: string;
  palette: Palette;
};

export default function Field({ label, children, hint, palette }: Props) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <label style={{ color: palette.cyan, fontWeight: 700, fontSize: 14 }}>{label}</label>
      {children}
      {hint ? <div style={{ color: palette.muted, fontSize: 12 }}>{hint}</div> : null}
    </div>
  );
}