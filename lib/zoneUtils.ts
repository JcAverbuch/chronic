import type { FormState } from "@/lib/types";

export type ZoneInfo = {
  zoneLabel: string;
  zonePercent: string;
  bpmRange: string;
};

export function getMaxHr(form: FormState): number {
  if (form.knownMaxHr && form.maxHrOverride > 0) return form.maxHrOverride;

  if (form.gender === "female") {
    return Math.round(206 - 0.88 * form.age);
  }

  if (form.gender === "male") {
    return Math.round(208 - 0.7 * form.age);
  }

  return Math.round(207 - 0.79 * form.age);
}

export function makeZoneInfo(
  maxHr: number,
  zoneLabel: string,
  lowPct: number,
  highPct: number,
): ZoneInfo {
  return {
    zoneLabel,
    zonePercent: `${Math.round(lowPct * 100)}-${Math.round(highPct * 100)}% MHR`,
    bpmRange: `${Math.round(maxHr * lowPct)}-${Math.round(maxHr * highPct)} bpm`,
  };
}

export function zone1(maxHr: number) {
  return makeZoneInfo(maxHr, "Zone 1", 0.55, 0.65);
}

export function zone2(maxHr: number) {
  return makeZoneInfo(maxHr, "Zone 2", 0.65, 0.75);
}

export function zone3(maxHr: number) {
  return makeZoneInfo(maxHr, "Zone 3", 0.75, 0.85);
}

export function zone4(maxHr: number) {
  return makeZoneInfo(maxHr, "Zone 4", 0.85, 0.9);
}