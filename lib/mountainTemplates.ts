import type { DayPlan, FormState, PhaseName, TrainingWeek } from "@/lib/types";
import { zone1, zone2, zone3, zone4 } from "@/lib/zoneUtils";

type Args = {
  weekNum: number;
  phase: PhaseName;
  isStepback: boolean;
  overallProgress: number;
  form: FormState;
  maxHr: number;
};

const days: DayPlan["day"][] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getStrengthDays(daysPerWeek: number) {
  return daysPerWeek <= 4 ? 1 : 2;
}

function getBaseStairMinutes(fitness: string) {
  if (fitness === "level0") return 20;
  if (fitness === "level1") return 25;
  if (fitness === "level2") return 30;
  return 45;
}

function phaseMultiplier(phase: PhaseName) {
  if (phase === "Base") return 1.0;
  if (phase === "Build") return 1.2;
  if (phase === "Peak") return 1.4;
  return 0.75;
}

function stepbackMultiplier(isStepback: boolean) {
  return isStepback ? 0.82 : 1;
}

function getPrimaryPeakTargets(form: FormState) {
  const peakGain = Math.round(form.elevationGain * 0.75);
  const peakDistance = Math.round(form.expectedDistance * 0.75 * 10) / 10;
  return { peakGain, peakDistance };
}

function getEstimatedPeakHours(form: FormState) {
  const distanceHours = form.expectedDistance * 0.45;
  const vertHours = form.elevationGain / 2500;
  const raw = Math.max(form.longestRecentEffort + 1, distanceHours + vertHours);
  return Math.min(10, Math.round(raw * 10) / 10);
}

function buildLongDayText(
  form: FormState,
  phase: PhaseName,
  overallProgress: number,
  isStepback: boolean,
) {
  const { peakGain, peakDistance } = getPrimaryPeakTargets(form);
  const peakHours = getEstimatedPeakHours(form);
  const longDayFactor =
    phase === "Peak"
      ? 1
      : phase === "Build"
        ? 0.72 + overallProgress * 0.18
        : phase === "Base"
          ? 0.45 + overallProgress * 0.15
          : 0.55;

  const stepback = stepbackMultiplier(isStepback);
  const gain = Math.round(peakGain * longDayFactor * stepback / 100) * 100;
  const distance = Math.round(peakDistance * longDayFactor * stepback * 10) / 10;
  const hours = Math.max(
    1.5,
    Math.round(peakHours * longDayFactor * stepback * 10) / 10,
  );

  if (form.outdoorVertAccess) {
    return {
      title: "Time on Feet Mountain Day",
      workout: `${hours} hr hike aiming for ~${gain.toLocaleString()} ft gain and ~${distance} mi. Carry pack if available.`,
      ...zone2(190), // overwritten below in builder
      notes: "Usually Saturday, but can shift to Sunday based on your weekend plans.",
      hours,
      gain,
      distance,
    };
  }

  return {
    title: "Time on Feet StairMaster Sim",
    workout: `${hours} hr total time on feet targeting ~${gain.toLocaleString()} ft equivalent and ~${distance} mi effort. Use StairMaster + incline walk if needed.`,
    ...zone2(190), // overwritten below in builder
    notes: "Usually Saturday, but can shift to Sunday based on your weekend plans.",
    hours,
    gain,
    distance,
  };
}

function buildGreenWeek({
  phase,
  isStepback,
  overallProgress,
  form,
  maxHr,
}: Omit<Args, "weekNum">): DayPlan[] {
  const strengthDays = getStrengthDays(form.daysPerWeek);
  const stairBase = getBaseStairMinutes(form.fitness);
  const phaseMult = phaseMultiplier(phase) * stepbackMultiplier(isStepback);
  const steadyStairs = Math.round(stairBase * phaseMult * (1 + overallProgress * 0.25));
  const hardStairs = Math.round(steadyStairs * 0.85);

  const longDay = buildLongDayText(form, phase, overallProgress, isStepback);
  const sundayBackToBackHours =
    phase === "Peak" ? Math.round(longDay.hours * 0.5 * 10) / 10 : Math.round(longDay.hours * 0.45 * 10) / 10;
  const sundayBackToBackGain =
    phase === "Peak" ? Math.round(longDay.gain * 0.5 / 100) * 100 : Math.round(longDay.gain * 0.35 / 100) * 100;

  const easyRecovery = zone1(maxHr);
  const aerobic = zone2(maxHr);
  const steadyHard = zone3(maxHr);
  const hard = zone4(maxHr);

  const week: DayPlan[] = [
    {
      day: "Mon",
      category: "mobility",
      title: "Recovery Walk + Mobility",
      workout: "25-40 min easy walk or gentle yoga.",
      ...easyRecovery,
      notes: "Keep this genuinely restorative.",
    },
    {
      day: "Tue",
      category: "quality",
      title: "Steady StairMaster",
      workout: `${steadyStairs} min StairMaster steady effort.`,
      ...steadyHard,
      notes: "This is your main steady Zone 3 stair day.",
    },
    {
      day: "Wed",
      category: "strength",
      title: strengthDays === 2 ? "Lower Body Strength" : "Full Body Strength",
      workout:
        strengthDays === 2
          ? "35-50 min lower body strength."
          : "35-50 min full body strength.",
      notes: "Keep it controlled and leave 1-2 reps in reserve.",
    },
    {
      day: "Thu",
      category: "quality",
      title: form.outdoorVertAccess ? "Uphill Aerobic Session" : "Stair Intervals",
      workout: form.outdoorVertAccess
        ? `${hardStairs} min uphill aerobic session or uphill run.`
        : `${hardStairs} min StairMaster with harder surges.`,
      ...hard,
      notes: "Harder than Tuesday, but not an all-out death march.",
    },
    {
      day: "Fri",
      category: strengthDays === 2 ? "strength" : "mobility",
      title: strengthDays === 2 ? "Upper Body + Core Strength" : "Walk / Yoga",
      workout:
        strengthDays === 2
          ? "30-45 min upper body + core strength."
          : "20-30 min walk, yoga, or mobility.",
      notes: "Arrive fresh enough for the weekend.",
    },
    {
      day: "Sat",
      category: "time_on_feet",
      title: longDay.title,
      workout: longDay.workout,
      ...aerobic,
      notes: longDay.notes,
    },
    {
      day: "Sun",
      category: phase === "Peak" ? "long" : "easy",
      title: phase === "Peak" ? "Back-to-Back Follow-Up" : "Easy Follow-Up Aerobic",
      workout:
        phase === "Peak"
          ? form.outdoorVertAccess
            ? `${sundayBackToBackHours} hr easy hike aiming for ~${sundayBackToBackGain.toLocaleString()} ft gain.`
            : `${sundayBackToBackHours} hr easy StairMaster / incline walk follow-up.`
          : "30-60 min easy walk, easy spin, or relaxed aerobic movement.",
      ...(phase === "Peak" ? aerobic : easyRecovery),
      notes:
        phase === "Peak"
          ? "Day two is intentionally 50% of day one."
          : "If your weekend is inverted, this can be the longer day instead.",
    },
  ];

  if (phase === "Taper") {
    week[3] = {
      day: "Thu",
      category: "skills",
      title: "Mountain Skills + Logistics",
      workout: "30-45 min of navigation, knot practice, or gear checks.",
      notes: "Stay sharp without creating fatigue.",
    };
    week[6] = {
      day: "Sun",
      category: "easy",
      title: "Easy Walk / Shakeout",
      workout: "20-40 min easy walk or very easy aerobic movement.",
      ...easyRecovery,
      notes: "Keep the legs moving but fresh.",
    };
  }

  return week;
}

function buildYellowWeek(green: DayPlan[], phase: PhaseName): DayPlan[] {
  return green.map((day, index) => {
    if (day.category === "quality") {
      return {
        ...day,
        category: "easy",
        title: `${day.title} (Reduced)`,
        workout:
          index === 1
            ? "25-40 min easy aerobic stairs or incline walk."
            : "25-40 min easy uphill aerobic or relaxed incline session.",
        zoneLabel: "Zone 2",
        zonePercent: "65-75% MHR",
        bpmRange: day.bpmRange,
        notes: "Keep the structure, reduce the spice.",
      };
    }

    if (day.category === "time_on_feet" || day.category === "long") {
      return {
        ...day,
        workout: `${day.workout} Reduce volume by ~25%.`,
        notes: "Keep the habit, try to go on a long walk.",
      };
    }

    if (day.category === "strength") {
      return {
        ...day,
        workout: "20-30 min lighter strength or skip if recovery is shaky.",
        notes: "Optional if fatigue is stacking up.",
      };
    }

    if (phase === "Peak" && day.day === "Sun") {
      return {
        ...day,
        title: "Short Easy Follow-Up",
        workout: "30-45 min easy walk, hike, or StairMaster only if you feel decent.",
        zoneLabel: "Zone 1",
        zonePercent: "55-65% MHR",
        notes: "No forced back-to-back heroics on a yellow week.",
      };
    }

    return day;
  });
}

function buildRedWeek(form: FormState, maxHr: number): DayPlan[] {
  const easyRecovery = zone1(maxHr);
  const aerobic = zone2(maxHr);

  return [
    {
      day: "Mon",
      category: "rest",
      title: "Real Rest",
      workout: "Rest. Full permission to do less.",
      notes: "Your job is recovery.",
    },
    {
      day: "Tue",
      category: "skills",
      title: "Mountain Skills Day",
      workout: "20-40 min of knots, navigation, packing, or gear familiarity.",
      notes: "This will probably save your life more than another leg day.",
    },
    {
      day: "Wed",
      category: "mobility",
      title: "Walk or Yoga",
      workout: "20-30 min walk, yoga, or gentle mobility.",
      ...easyRecovery,
    },
    {
      day: "Thu",
      category: "skills",
      title: "Mountain Skills Day",
      workout: "20-40 min of map work, route review, or gear prep.",
      notes: "Keep momentum without forcing load.",
    },
    {
      day: "Fri",
      category: "rest",
      title: "Optional Full Rest",
      workout: "Rest, or a 10-20 min stroll if that feels good.",
      notes: "No guilt either way.",
    },
    {
      day: "Sat",
      category: "time_on_feet",
      title: "Gentle Time on Feet",
      workout: "30-75 min easy walk or very easy hike.",
      ...aerobic,
      notes: "Keep it conversational and cut it short whenever needed.",
    },
    {
      day: "Sun",
      category: "strength",
      title: "Optional Light Strength",
      workout: "15-25 min gentle full-body strength or skip.",
      notes: "Only if your body is actually receptive.",
    },
  ];
}

export function buildMountainWeek(args: Args): TrainingWeek {
  const green = buildGreenWeek(args);
  const yellow = buildYellowWeek(green, args.phase);
  const red = buildRedWeek(args.form, args.maxHr);

  return {
    weekNum: args.weekNum,
    phase: args.phase,
    isStepback: args.isStepback,
    green,
    yellow,
    red,
  };
}