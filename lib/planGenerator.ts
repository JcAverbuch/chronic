import type { Adventure, FormState, Palette, PhaseName, TrainingWeek } from "@/lib/types";
import { buildMountainWeek } from "@/lib/mountainTemplates";
import { buildUltraWeek } from "@/lib/ultraTemplates";
import { getMaxHr } from "@/lib/zoneUtils";

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
}: Args): TrainingWeek[] {
  const totalWeeks = weeksUntilEvent;

  const taperWeeks =
    adventure === "mountain"
      ? Math.max(2, Math.min(3, totalWeeks - 2))
      : totalWeeks >= 10
        ? 2
        : 1;

  let peakWeeks = totalWeeks >= 12 ? 2 : 1;

  const remainingAfterTaper = Math.max(2, totalWeeks - taperWeeks);

  let buildRatio = form.volatility === "unstable" ? 0.5 : 0.6;
  if (form.fitness === "level3") buildRatio -= 0.08;

  let buildWeeks = Math.max(2, Math.floor((remainingAfterTaper - peakWeeks) * buildRatio));
  let baseWeeks = Math.max(1, totalWeeks - taperWeeks - peakWeeks - buildWeeks);

  if (form.volatility === "unstable" && peakWeeks > 1) {
    peakWeeks -= 1;
    baseWeeks += 1;
  }

  const maxHr = getMaxHr(form);

  function phaseForWeek(index: number): PhaseName {
    if (index < baseWeeks) return "Base";
    if (index < baseWeeks + buildWeeks) return "Build";
    if (index < totalWeeks - taperWeeks) return "Peak";
    return "Taper";
  }

  function getStepback(index: number) {
    const humanWeek = index + 1;
    if (phaseForWeek(index) === "Taper") return false;
    if (form.volatility === "unstable") return humanWeek % 3 === 0;
    return humanWeek % 4 === 0;
  }

  return Array.from({ length: totalWeeks }, (_, index) => {
    const phase = phaseForWeek(index);
    const isStepback = getStepback(index);
    const overallProgress = totalWeeks === 1 ? 1 : index / (totalWeeks - 1);

    const commonArgs = {
      weekNum: index + 1,
      phase,
      isStepback,
      overallProgress,
      form,
      maxHr,
    };

    return adventure === "mountain"
      ? buildMountainWeek(commonArgs)
      : buildUltraWeek(commonArgs);
  });
}