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

function getStrengthDays(daysPerWeek: number) {
  return daysPerWeek <= 4 ? 1 : 2;
}

function getEasyMileageRange(fitness: string) {
  if (fitness === "level0") return "2-4 mi";
  if (fitness === "level1") return "4-6 mi";
  if (fitness === "level2") return "5-8 mi";
  return "6-10 mi";
}

function getLongRunRange(phase: PhaseName, fitness: string) {
  if (phase === "Base") {
    if (fitness === "level0") return "6-10 mi";
    if (fitness === "level1") return "8-12 mi";
    if (fitness === "level2") return "10-16 mi";
    return "12-18 mi";
  }

  if (phase === "Build") {
    if (fitness === "level0") return "8-12 mi";
    if (fitness === "level1") return "12-18 mi";
    if (fitness === "level2") return "14-22 mi";
    return "16-24 mi";
  }

  if (phase === "Peak") {
    if (fitness === "level0") return "10-14 mi";
    if (fitness === "level1") return "14-20 mi";
    if (fitness === "level2") return "18-26 mi";
    return "20-30 mi";
  }

  if (fitness === "level0") return "5-8 mi";
  if (fitness === "level1") return "8-12 mi";
  if (fitness === "level2") return "8-15 mi";
  return "10-16 mi";
}

function getQualityRotation(weekNum: number) {
  const cycle = (weekNum - 1) % 3;
  if (cycle === 0) return "hills";
  if (cycle === 1) return "tempo";
  return "intervals";
}

function buildGreenWeek({
  weekNum,
  phase,
  isStepback,
  form,
  maxHr,
}: Omit<Args, "overallProgress">): DayPlan[] {
  const strengthDays = getStrengthDays(form.daysPerWeek);
  const easyZone = zone2(maxHr);
  const tempoZone = {
    zoneLabel: "Tempo / Threshold",
    zonePercent: "80-88% MHR",
    bpmRange: `${Math.round(maxHr * 0.8)}-${Math.round(maxHr * 0.88)} bpm`,
  };
  const hardZone = zone4(maxHr);

  const easyRange = getEasyMileageRange(form.fitness);
  const longRange = getLongRunRange(phase, form.fitness);
  const rotation = getQualityRotation(weekNum);
  const tempoAllowed = phase === "Build" && form.volatility !== "unstable";

  let workoutDay: DayPlan = {
    day: "Wed",
    category: "quality",
    title: "Hill Workout",
    workout: `2 mi easy, hill workout, 2 mi easy. Keep it smooth and controlled.`,
    ...hardZone,
    notes: "Like 12-3-30 but maybe 5-5-until you can't anymore.",
  };

  if (rotation === "tempo" && tempoAllowed) {
    workoutDay = {
      day: "Wed",
      category: "quality",
      title: "Tempo Run",
      workout: `2 mi easy, 20-30 min tempo, 2 mi easy.`,
      ...tempoZone,
      notes: "Tempo only appears on green build weeks.",
    };
  } else if (rotation === "intervals") {
    workoutDay = {
      day: "Wed",
      category: "quality",
      title: "Intervals / Threshold",
      workout: `2 mi easy, threshold-style intervals, 2 mi easy.`,
      ...hardZone,
      notes: "Try to speed up ~1min / mile in 0.5 mile intervals.",
    };
  }

  if (phase === "Base") {
    workoutDay = {
      day: "Wed",
      category: "quality",
      title: rotation === "intervals" ? "Hill + Stride Session" : "Hill Session",
      workout:
        rotation === "intervals"
          ? `2 mi easy, short hill reps plus relaxed fast strides, 2 mi easy.`
          : `2 mi easy, hill session, 2 mi easy.`,
      ...hardZone,
      notes: "Base phase keeps quality shorter and simpler.",
    };
  }

  if (phase === "Taper") {
    workoutDay = {
      day: "Wed",
      category: "quality",
      title: "Controlled Sharpening",
      workout: "2 mi easy, short controlled moderate effort, 2 mi easy.",
      ...tempoZone,
      notes: "Keep rhythm without creating fatigue.",
    };
  }

  const week: DayPlan[] = [
    {
      day: "Mon",
      category: "rest",
      title: "Rest",
      workout: "Rest day.",
      notes: "Most important day of the week.",
    },
    {
      day: "Tue",
      category: "easy",
      title: "Easy Run + Hills / Strides",
      workout: `${easyRange} easy with short hills or strides at the end.`,
      ...easyZone,
      notes: "Run relaxed. Speed up a tad for an effort boost.",
    },
    workoutDay,
    {
      day: "Thu",
      category: "easy",
      title: "Easy Run",
      workout: `${easyRange} easy.`,
      ...easyZone,
      notes: "Can swap for aerobic cross-training if needed.",
    },
    {
      day: "Fri",
      category: strengthDays === 2 ? "strength" : "rest",
      title: strengthDays === 2 ? "Upper Body + Core Strength" : "Rest / Cross-Train",
      workout:
        strengthDays === 2
          ? "25-40 min upper body + core strength."
          : "Rest, cross-train, or 20-40 min recovery walk.",
      notes: "Break up the running.",
    },
    {
      day: "Sat",
      category: "long",
      title: "Long Run",
      workout: `${longRange} on trails if possible.`,
      ...easyZone,
      notes:
        phase === "Peak"
          ? "Main long run of the week."
          : "Keep it at a conversational pace.",
    },
    {
      day: "Sun",
      category: phase === "Peak" ? "easy" : "easy",
      title: phase === "Peak" ? "Back-to-Back Easy Run" : "Easy Run / Hike",
      workout:
        phase === "Peak"
          ? `Shorter easy run or hike at roughly 50-60% of Saturday load.`
          : `${easyRange} easy, or a long hike if that sounds more fun.`,
      ...easyZone,
      notes:
        phase === "Peak"
          ? "Keep it easier than Saturday."
          : "Time on feet still counts. If you can't run, go on a long walk.",
    },
  ];

  if (strengthDays === 1) {
    week[3] = {
      day: "Thu",
      category: "strength",
      title: "Full Body Strength",
      workout: "30-45 min full body strength, then optional short easy walk.",
      notes: "One strength day for lower training frequency weeks.",
    };
  }

  if (isStepback) {
    week[5] = {
      ...week[5],
      title: "Step-Back Long Run",
      workout: `${easyRange} to shorter end of long-run range. Stay relaxed.`,
      notes: "Take it easy!.",
    };
  }

  if (phase === "Taper") {
    week[6] = {
      day: "Sun",
      category: "easy",
      title: "Easy Shakeout / Rest",
      workout: "Short easy run, hike, or full rest if fatigue is lingering.",
      ...easyZone,
      notes: "Err on the side of freshness.",
    };
  }

  return week;
}

function buildYellowWeek(green: DayPlan[]): DayPlan[] {
  return green.map((day) => {
    if (day.category === "quality") {
      return {
        ...day,
        category: "easy",
        title: `${day.title} (Downgraded)`,
        workout: "30-50 min easy run or aerobic cross-train.",
        zoneLabel: "Zone 2",
        zonePercent: "65-75% MHR",
        notes: "Keep the habit, if running is too tough try an incline walk.",
      };
    }

    if (day.category === "long") {
      return {
        ...day,
        title: "Reduced Long Run",
        workout: `${day.workout} Reduce duration by ~20-25%.`,
        notes: "Finish with plenty left in the tank.",
      };
    }

    if (day.category === "strength") {
      return {
        ...day,
        workout: "20-30 min lighter strength or skip.",
        notes: "Optional if fatigue is loud.",
      };
    }

    if (day.day === "Sun") {
      return {
        ...day,
        workout: "20-45 min easy run, easy walk, or hike.",
        notes: "Keep it truly easy.",
      };
    }

    return day;
  });
}

function buildRedWeek(maxHr: number): DayPlan[] {
  const easyZone = zone1(maxHr);

  return [
    {
      day: "Mon",
      category: "rest",
      title: "Real Rest",
      workout: "Rest day.",
      notes: "Recovery is the assignment.",
    },
    {
      day: "Tue",
      category: "easy",
      title: "Optional Easy Run",
      workout: "20-35 min easy run or easy walk.",
      ...easyZone,
      notes: "Skip it if your body is not having it, or change to an incline walk.",
    },
    {
      day: "Wed",
      category: "mobility",
      title: "Walk / Yoga / Mobility",
      workout: "20-30 min gentle movement.",
      ...easyZone,
    },
    {
      day: "Thu",
      category: "easy",
      title: "Optional Easy Run",
      workout: "20-40 min easy run or easy cross-train.",
      ...easyZone,
      notes: "This is optional, not homework.",
    },
    {
      day: "Fri",
      category: "rest",
      title: "Rest",
      workout: "Rest or very short stroll.",
      notes: "No sneaky intensity.",
    },
    {
      day: "Sat",
      category: "time_on_feet",
      title: "Gentle Time on Feet",
      workout: "30-60 min walk, hike, or very easy jog-walk.",
      ...easyZone,
      notes: "Just enough to stay in touch with movement.",
    },
    {
      day: "Sun",
      category: "strength",
      title: "Optional Light Strength",
      workout: "15-25 min light full-body strength or mobility only.",
      notes: "Take the win if all you manage is stretching.",
    },
  ];
}

export function buildUltraWeek(args: Args): TrainingWeek {
  const green = buildGreenWeek(args);
  const yellow = buildYellowWeek(green);
  const red = buildRedWeek(args.maxHr);

  return {
    weekNum: args.weekNum,
    phase: args.phase,
    isStepback: args.isStepback,
    green,
    yellow,
    red,
  };
}