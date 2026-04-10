export type Adventure = "mountain" | "ultramarathon";
export type WeekMode = "green" | "yellow" | "red";
export type PhaseName = "Base Arc" | "Build Arc" | "Peak Arc" | "Final Boss: Taper";

export type FormState = {
  eventDate: string;
  fitness: string;
  daysPerWeek: number;
  longestRecentEffort: number;
  volatility: string;
  recoveryTolerance: string;

  age: number;
  gender: string;
  knownMaxHr: boolean;
  maxHrOverride: number;

  elevationGain: number;
  expectedDistance: number;
  altitudeExperience: string;
  hillAccess: string;
  outdoorVertAccess: boolean;
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

export type DayCategory =
  | "rest"
  | "easy"
  | "quality"
  | "strength"
  | "long"
  | "skills"
  | "time_on_feet"
  | "mobility";

export type DayPlan = {
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  category: DayCategory;
  title: string;
  workout: string;
  zoneLabel?: string;
  zonePercent?: string;
  bpmRange?: string;
  notes?: string;
};

export type TrainingWeek = {
  weekNum: number;
  phase: PhaseName;
  isStepback: boolean;
  green: DayPlan[];
  yellow: DayPlan[];
  red: DayPlan[];
};