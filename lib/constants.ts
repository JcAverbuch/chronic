import type { FormState, Palette } from "@/lib/types";

export const palette: Palette = {
  bg: "#080312",
  panel: "#12091f",
  panel2: "#1a1030",
  pink: "#ff4fd8",
  purple: "#8856ff",
  cyan: "#37e7ff",
  yellow: "#ffe45e",
  green: "#69ff8e",
  red: "#ff5c7a",
  white: "#f6f2ff",
  muted: "#cab7f7",
  border: "#3d2d67",
};

export const initialForm: FormState = {
  eventDate: "",
  fitness: "level1",
  daysPerWeek: 4,
  longestRecentEffort: 2,
  volatility: "volatile",
  recoveryTolerance: "medium",

  age: 30,
  gender: "female",
  knownMaxHr: false,
  maxHrOverride: 0,

  elevationGain: 4000,
  expectedDistance: 8,
  altitudeExperience: "none",
  hillAccess: "some",
  outdoorVertAccess: false,
  packTraining: true,
  technicalTerrain: false,

  weeklyMileage: 25,
  raceSurface: "trail",
  vertRequired: true,
  raceGoal: "finish strong",
};

export const stageLabels = [
  "START",
  "CHOOSE YOUR SUFFERING",
  "MISSION SETUP",
  "BOSS BATTLE PLAN",
];