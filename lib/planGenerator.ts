import { Adventure, FormState, Palette, TrainingWeek } from "@/lib/types";

type Args = {
  adventure: Adventure;
  form: FormState;
  weeksUntilEvent: number;
  palette: Palette;
};

export function generateTrainingPlan({
  adventure,
  form,
  weeksUntilEvent,
  palette,
}: Args): TrainingWeek[] {
  const totalWeeks = weeksUntilEvent;
  const taperWeeks = totalWeeks >= 10 ? 2 : 1;
  const peakWeeks = totalWeeks >= 12 ? 2 : 1;
  const buildWeeks = Math.max(2, Math.floor((totalWeeks - taperWeeks - peakWeeks) * 0.6));
  const baseWeeks = Math.max(1, totalWeeks - taperWeeks - peakWeeks - buildWeeks);

  const volatilityMultiplier =
    form.volatility === "stable"
      ? 1.0
      : form.volatility === "volatile"
        ? 0.9
        : 0.78;

  const fitnessMultiplier =
    form.fitness === "level0"
      ? 0.75
      : form.fitness === "level1"
        ? 0.9
        : form.fitness === "level2"
          ? 1.0
          : 1.12;

  const recoveryMultiplier =
    form.recoveryTolerance === "low"
      ? 0.82
      : form.recoveryTolerance === "medium"
        ? 1.0
        : 1.08;

  const progressionTuning =
    0.85 + volatilityMultiplier * fitnessMultiplier * recoveryMultiplier * 0.15;

  const daysPerWeek = Number(form.daysPerWeek || 4);
  const longestRecentEffort = Number(form.longestRecentEffort || 2);
  const currentMileage = Number(form.weeklyMileage || 20);

  function phaseForWeek(index: number) {
    if (index < baseWeeks) return "Base Arc";
    if (index < baseWeeks + buildWeeks) return "Build Arc";
    if (index < totalWeeks - taperWeeks) return "Peak Arc";
    return "Final Boss: Taper";
  }

  function getStepback(index: number) {
    const humanWeek = index + 1;
    return humanWeek % 4 === 0 && humanWeek < totalWeeks - taperWeeks;
  }

  function rampForWeek(index: number) {
    let progress = 1;
    for (let i = 0; i <= index; i += 1) {
      const phase = phaseForWeek(i);
      const isStepback = getStepback(i);

      if (phase === "Final Boss: Taper") {
        progress *= i === totalWeeks - 1 ? 0.72 : 0.84;
      } else if (isStepback) {
        progress *= 0.9;
      } else if (phase === "Base Arc") {
        progress *= 1.07 * progressionTuning;
      } else if (phase === "Build Arc") {
        progress *= 1.09 * progressionTuning;
      } else if (phase === "Peak Arc") {
        progress *= 1.05 * progressionTuning;
      }
    }
    return progress;
  }

  function mountainWeek(index: number) {
    const phase = phaseForWeek(index);
    const isStepback = getStepback(index);
    const ramp = rampForWeek(index);
    const sessions = Math.max(3, daysPerWeek);

    const maxMountainLongEffort =
      form.fitness === "level0"
        ? 5.5
        : form.fitness === "level1"
          ? 6.5
          : form.fitness === "level2"
            ? 8
            : 9;

    const vertCap =
      form.fitness === "level0"
        ? 5000
        : form.fitness === "level1"
          ? 6500
          : form.fitness === "level2"
            ? 8000
            : 9500;

    const longEffort = Math.max(
      1.5,
      Math.round(Math.min(longestRecentEffort * ramp, maxMountainLongEffort) * 10) / 10,
    );

    const vertBase = Number(form.elevationGain || 4000);
    const vertTarget =
      Math.round(
        (Math.min(vertBase * 0.7, vertCap) * Math.min(ramp, 1.5)) / 100,
      ) * 100;

    let focus = "Build uphill engine and stop beefing with Zone 2";
    if (phase === "Build Arc") focus = "Add vert, pack work, and muscular endurance";
    if (phase === "Peak Arc") focus = "Practice mountain-specific suffering without cooking recovery";
    if (phase === "Final Boss: Taper") focus = "Arrive fresh, springy, and only lightly haunted";
    if (isStepback) focus = "Step-back week. Consolidate fitness and act your age";

    const quality = form.technicalTerrain
      ? "One technical-footwork or descending session"
      : "One uphill tempo or sustained climbing session";

    return {
      longMetric: `${longEffort} hr hike / climb sim`,
      volumeMetric: `${vertTarget.toLocaleString()} ft vert target`,
      focus,
      sideQuest: form.packTraining
        ? "Do one pack carry or stair goblin workout"
        : "Improvise vert with treadmill, stairs, or urban nonsense",
      strength: "Single-leg work, calves, glutes, trunk, and eccentric downhill legs",
      keySession: quality,
      sessions,
      isStepback,
      phase,
    };
  }

  function ultraWeek(index: number) {
    const phase = phaseForWeek(index);
    const isStepback = getStepback(index);
    const ramp = rampForWeek(index);
    const sessions = Math.max(3, daysPerWeek);

    const maxWeeklyMiles =
      form.fitness === "level0"
        ? 35
        : form.fitness === "level1"
          ? 45
          : form.fitness === "level2"
            ? 60
            : 75;

    const maxLongRunHours =
      form.fitness === "level0"
        ? 4
        : form.fitness === "level1"
          ? 5
          : form.fitness === "level2"
            ? 6.5
            : 7.5;

    const weeklyMiles = Math.round(Math.min(currentMileage * ramp, maxWeeklyMiles));
    const longRun = Math.max(
      1.5,
      Math.round(Math.min(longestRecentEffort * ramp, maxLongRunHours) * 10) / 10,
    );

    let focus = "Build aerobic durability and remember easy means easy";
    if (phase === "Build Arc") focus = "Increase mileage and long-run confidence";
    if (phase === "Peak Arc") focus = "Practice race-specific fatigue, fueling, and restraint";
    if (phase === "Final Boss: Taper") focus = "Freshen up without inventing a last-minute hero complex";
    if (isStepback) focus = "Step-back week. Reduce load and let the adaptations catch up";

    const quality = form.vertRequired
      ? "One hill session or rolling long run"
      : "One tempo, steady-state, or marathon-effort session";

    return {
      longMetric: `${longRun} hr long run`,
      volumeMetric: `${weeklyMiles} mi target`,
      focus,
      sideQuest: form.vertRequired
        ? "Sneak in hills so race day feels slightly less rude"
        : "Practice fueling before your stomach files an HR complaint",
      strength: "Posterior chain, hips, feet, calves, and anti-chaos core work",
      keySession: quality,
      sessions,
      isStepback,
      phase,
    };
  }

  return Array.from({ length: totalWeeks }, (_, index) => {
    const core = adventure === "mountain" ? mountainWeek(index) : ultraWeek(index);
    const deloadText = core.isStepback
      ? "This is a step-back week. Pull the handbrake a bit so your body doesn’t do it for you."
      : "This week can progress normally if your body isn’t actively filing grievances.";

    return {
      weekNum: index + 1,
      ...core,
      coachNote:
        core.phase === "Peak Arc"
          ? "Heroism is not the same thing as overcooking your nervous system."
          : core.phase === "Final Boss: Taper"
            ? "Your main workout is not panicking."
            : core.isStepback
              ? "Recovery is training, even if your ego boos from the audience."
              : "Consistency beats one deranged mega-session every time.",
      green: {
        label: "GREEN MODE",
        border: palette.green,
        summary: `${core.sessions} sessions • ${core.longMetric} • ${core.volumeMetric}`,
        text: `${core.keySession}. One strength day. One actual recovery ritual. ${deloadText}`,
      },
      yellow: {
        label: "YELLOW MODE",
        border: palette.yellow,
        summary: "Trim 20–30% • keep one pillar • reduce spice",
        text: "Keep either the long effort or the key session, not both at full power. Cut accessory work, shorten easy sessions, and sub in walking or easy cross-training as needed.",
      },
      red: {
        label: "RED MODE",
        border: palette.red,
        summary: "Maintenance week • zero glory • preserve the save file",
        text: "Walking, mobility, easy spin, light rehab strength, naps, hydration, nervous-system peace treaties. No progression required. Resume when the boss music fades.",
      },
    };
  });
}