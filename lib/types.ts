export type Adventure = "mountain" | "ultramarathon";
export type WeekMode = "green" | "yellow" | "red";

export type FormState = {
  eventDate: string;
  fitness: string;
  daysPerWeek: number;
  longestRecentEffort: number;
  volatility: string;
  recoveryTolerance: string;
  elevationGain: number;
  altitudeExperience: string;
  hillAccess: string;
  packTraining: boolean;
  technicalTerrain: boolean;
  weeklyMileage: number;
  raceSurface: string;
  vertRequired: boolean;
  raceGoal: string;
};

export type Palette = {
  bg: string;
  panel: string;
  panel2: string;
  pink: string;
  purple: string;
  cyan: string;
  yellow: string;
  green: string;
  red: string;
  white: string;
  muted: string;
  border: string;
};

export type ModeBlock = {
  label: string;
  border: string;
  summary: string;
  text: string;
};

export type TrainingWeek = {
  weekNum: number;
  longMetric: string;
  volumeMetric: string;
  focus: string;
  sideQuest: string;
  strength: string;
  keySession: string;
  sessions: number;
  isStepback: boolean;
  phase: string;
  coachNote: string;
  green: ModeBlock;
  yellow: ModeBlock;
  red: ModeBlock;
};