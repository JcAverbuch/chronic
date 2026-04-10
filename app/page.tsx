"use client";

import { useMemo, useState } from "react";
import AdventureCard from "@/components/AdventureCard";
import ArrowButton from "@/components/ArrowButton";
import Field from "@/components/Field";
import StepHeader from "@/components/StepHeader";
import WeekCard from "@/components/WeekCard";
import { initialForm, palette, stageLabels } from "@/lib/constants";
import { generateTrainingPlan } from "@/lib/planGenerator";
import { Adventure, FormState, WeekMode } from "@/lib/types";

console.log("AdventureCard:", AdventureCard);
console.log("StepHeader:", StepHeader);
console.log("ArrowButton:", ArrowButton);
console.log("Field:", Field);
console.log("WeekCard:", WeekCard);

export default function Page() {
  const [step, setStep] = useState(0);
  const [adventure, setAdventure] = useState<Adventure>("mountain");
  const [weekModes, setWeekModes] = useState<Record<number, WeekMode>>({});
  const [form, setForm] = useState<FormState>(initialForm);

  const updateForm = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const weeksUntilEvent = useMemo(() => {
    if (!form.eventDate) return 16;
    const today = new Date();
    const event = new Date(form.eventDate + "T00:00:00");
    const diff = Math.ceil((event.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 7));
    return Math.max(4, diff);
  }, [form.eventDate]);

  const trainingPlan = useMemo(
    () => generateTrainingPlan({ adventure, form, weeksUntilEvent, palette }),
    [adventure, form, weeksUntilEvent]
  );

  const stats = useMemo(() => {
    const endurance = Math.min(100, Math.round(Number(form.longestRecentEffort || 1) * 18));
    const availability = Math.min(100, Number(form.daysPerWeek || 4) * 16);
    const chaosResistance =
      form.volatility === "stable"
        ? 82
        : form.volatility === "volatile"
          ? 58
          : 33;
    const vertTolerance =
      adventure === "mountain"
        ? form.hillAccess === "excellent"
          ? 85
          : form.hillAccess === "some"
            ? 58
            : 28
        : form.vertRequired
          ? 61
          : 35;
    const flareResilience =
      form.recoveryTolerance === "high" ? 78 : form.recoveryTolerance === "medium" ? 55 : 37;

    return [
      ["ENDURANCE", endurance, palette.cyan],
      ["TIME SLOTS", availability, palette.pink],
      ["CHAOS RESIST", chaosResistance, palette.yellow],
      ["VERT TOL", vertTolerance, palette.green],
      ["FLARE RES", flareResilience, palette.red],
    ] as const;
  }, [adventure, form]);

  const activeMode = (weekNum: number): WeekMode => weekModes[weekNum] || "green";

  const setMode = (weekNum: number, mode: WeekMode) => {
    setWeekModes((prev) => ({ ...prev, [weekNum]: mode }));
  };

  const pixelShadow = `0 0 0 2px ${palette.border}, 0 0 0 4px #000, 0 0 18px rgba(255,79,216,0.18)`;

  const panelStyle: React.CSSProperties = {
    background: `linear-gradient(180deg, ${palette.panel2}, ${palette.panel})`,
    border: `2px solid ${palette.border}`,
    boxShadow: pixelShadow,
    borderRadius: 8,
  };

  const inputStyle: React.CSSProperties = {
    background: "#090511",
    color: palette.white,
    border: `2px solid ${palette.border}`,
    padding: "12px 14px",
    borderRadius: 6,
    width: "100%",
    fontSize: 14,
    outline: "none",
  };

  const sectionTitle = (text: string) => (
    <div
      style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 14,
        color: palette.yellow,
        letterSpacing: 1,
        textTransform: "uppercase",
      }}
    >
      {text}
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(136,86,255,0.22), transparent 30%), radial-gradient(circle at bottom, rgba(55,231,255,0.12), transparent 25%), #080312",
        color: palette.white,
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        padding: 24,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Inter:wght@400;500;700;800&display=swap');
        * { box-sizing: border-box; }
        button, input, select { font-family: inherit; }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gap: 20 }}>
        <StepHeader
          step={step}
          panelStyle={panelStyle}
          palette={palette}
          stageLabels={stageLabels}
        />

        {step === 0 && (
          <div style={{ ...panelStyle, padding: 32, textAlign: "center", display: "grid", gap: 18 }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 20, color: palette.yellow, lineHeight: 1.7 }}>
              TRAIN FOR A MOUNTAIN OR A 50-MILER
              <br />
              despite doctors orders
            </div>
            <div style={{ color: palette.muted, maxWidth: 760, margin: "0 auto", lineHeight: 1.6 }}>
              Receive a training plan with green, yellow, and red options for when your body is cooperative, suspicious, or being really fucking annoying.
            </div>
            <div>
              <button
                onClick={() => setStep(1)}
                style={{
                  background: palette.green,
                  color: "#12091f",
                  border: `2px solid ${palette.green}`,
                  borderRadius: 8,
                  padding: "14px 16px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  cursor: "pointer",
                  boxShadow: `0 0 18px ${palette.green}77`,
                }}
              >
                Begin Delusions
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div style={{ display: "grid", gap: 18 }}>
            <div style={{ ...panelStyle, padding: 20, display: "grid", gap: 16 }}>
              {sectionTitle("Choose Your Suffering")}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
                <AdventureCard
                  type="mountain"
                  accent={palette.cyan}
                  active={adventure === "mountain"}
                  onClick={setAdventure}
                  panelStyle={panelStyle}
                  pixelShadow={pixelShadow}
                  palette={palette}
                />
                <AdventureCard
                  type="ultramarathon"
                  accent={palette.pink}
                  active={adventure === "ultramarathon"}
                  onClick={setAdventure}
                  panelStyle={panelStyle}
                  pixelShadow={pixelShadow}
                  palette={palette}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <ArrowButton direction="left" onClick={() => setStep(0)} />
              <ArrowButton onClick={() => setStep(2)} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "grid", gap: 18 }}>
            <div style={{ ...panelStyle, padding: 20, display: "grid", gap: 20 }}>
              {sectionTitle("Mission Setup")}

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                <Field label="Event date" hint="When are we attempting this terrible idea?" palette={palette}>
                  <input type="date" value={form.eventDate} onChange={(e) => updateForm("eventDate", e.target.value)} style={inputStyle} />
                </Field>

                <Field label="Current fitness class" palette={palette}>
                  <select value={form.fitness} onChange={(e) => updateForm("fitness", e.target.value)} style={inputStyle}>
                    <option value="level0">very limited</option>
                    <option value="level1">in "okay" shape</option>
                    <option value="level2">not my first rodeo</option>
                    <option value="level3">barkley looks easy</option>
                  </select>
                </Field>

                <Field label="Days per week available" palette={palette}>
                  <select value={form.daysPerWeek} onChange={(e) => updateForm("daysPerWeek", Number(e.target.value))} style={inputStyle}>
                    {[3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </Field>

                <Field label="Longest recent effort (hours)" hint="Your current long run, hike, or all-day nonsense." palette={palette}>
                  <input type="number" min="1" max="12" step="0.5" value={form.longestRecentEffort} onChange={(e) => updateForm("longestRecentEffort", Number(e.target.value))} style={inputStyle} />
                </Field>

                <Field label="How annoying is your body lately?" palette={palette}>
                  <select value={form.volatility} onChange={(e) => updateForm("volatility", e.target.value)} style={inputStyle}>
                    <option value="stable">mostly stable</option>
                    <option value="volatile">mischievous</option>
                    <option value="unstable">most days suck</option>
                  </select>
                </Field>

                <Field label="Recovery tolerance" palette={palette}>
                  <select value={form.recoveryTolerance} onChange={(e) => updateForm("recoveryTolerance", e.target.value)} style={inputStyle}>
                    <option value="low">a bad day wipes out my week</option>
                    <option value="medium">i'll be fine in a couple days</option>
                    <option value="high">tomorrow's a new day!</option>
                  </select>
                </Field>
              </div>

              {adventure === "mountain" ? (
                <div style={{ display: "grid", gap: 16 }}>
                  {sectionTitle("Mountain Stats")}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                    <Field label="Expected elevation gain (ft)" palette={palette}>
                      <input type="number" min="1000" step="500" value={form.elevationGain} onChange={(e) => updateForm("elevationGain", Number(e.target.value))} style={inputStyle} />
                    </Field>
                    <Field label="Altitude experience" palette={palette}>
                      <select value={form.altitudeExperience} onChange={(e) => updateForm("altitudeExperience", e.target.value)} style={inputStyle}>
                        <option>none</option>
                        <option>a little</option>
                        <option>pretty comfy</option>
                      </select>
                    </Field>
                    <Field label="Access to hills or stairs" palette={palette}>
                      <select value={form.hillAccess} onChange={(e) => updateForm("hillAccess", e.target.value)} style={inputStyle}>
                        <option>none</option>
                        <option>some</option>
                        <option>excellent</option>
                      </select>
                    </Field>
                    <Field label="Pack training access" palette={palette}>
                      <select value={String(form.packTraining)} onChange={(e) => updateForm("packTraining", e.target.value === "true")} style={inputStyle}>
                        <option value="true">yes</option>
                        <option value="false">no</option>
                      </select>
                    </Field>
                    <Field label="Technical terrain?" palette={palette}>
                      <select value={String(form.technicalTerrain)} onChange={(e) => updateForm("technicalTerrain", e.target.value === "true")} style={inputStyle}>
                        <option value="false">no</option>
                        <option value="true">yes</option>
                      </select>
                    </Field>
                  </div>
                </div>
              ) : (
                <div style={{ display: "grid", gap: 16 }}>
                  {sectionTitle("Ultra Stats")}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                    <Field label="Current weekly mileage" palette={palette}>
                      <input type="number" min="5" step="5" value={form.weeklyMileage} onChange={(e) => updateForm("weeklyMileage", Number(e.target.value))} style={inputStyle} />
                    </Field>
                    <Field label="Trail or road?" palette={palette}>
                      <select value={form.raceSurface} onChange={(e) => updateForm("raceSurface", e.target.value)} style={inputStyle}>
                        <option value="trail">trail</option>
                        <option value="road">road</option>
                      </select>
                    </Field>
                    <Field label="Vert required?" palette={palette}>
                      <select value={String(form.vertRequired)} onChange={(e) => updateForm("vertRequired", e.target.value === "true")} style={inputStyle}>
                        <option value="true">yes</option>
                        <option value="false">no</option>
                      </select>
                    </Field>
                    <Field label="Race goal" palette={palette}>
                      <select value={form.raceGoal} onChange={(e) => updateForm("raceGoal", e.target.value)} style={inputStyle}>
                        <option>survive</option>
                        <option>finish strong</option>
                        <option>feral</option>
                      </select>
                    </Field>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <ArrowButton direction="left" onClick={() => setStep(1)} />
              <ArrowButton onClick={() => setStep(3)} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: "grid", gap: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 380px) 1fr", gap: 18 }}>
              <div style={{ ...panelStyle, padding: 20, display: "grid", gap: 18, alignSelf: "start" }}>
                {sectionTitle("Versus Screen")}
                {/* keep your existing stats / versus block here */}
              </div>

              <div style={{ display: "grid", gap: 16 }}>
                {trainingPlan.map((week) => (
                  <WeekCard
                    key={week.weekNum}
                    week={week}
                    activeMode={activeMode(week.weekNum)}
                    setMode={setMode}
                    panelStyle={panelStyle}
                    palette={palette}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <ArrowButton direction="left" onClick={() => setStep(2)} />
              <ArrowButton onClick={() => setStep(0)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}