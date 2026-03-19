"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { RangeGauge } from "@/components/ui/range-gauge";
import { ResultCard } from "@/components/ui/result-card";
import { SelectField } from "@/components/ui/select-field";
import { decisionCalculatorConfigs } from "@/data/life-decision-config";
import type { LifeDecisionCalculatorSlug } from "@/data/life-decision-config";
import { calculateDecisionOutcome } from "@/lib/calculators/life-decisions";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { cn, formatNumber } from "@/lib/utils";

import {
  CalculatorActions,
  ComparisonControls,
  DecisionSummaryPanel,
  EmptyCalculatorState,
  ExamplePresetList,
  InsightPanel
} from "./shared";

function buildInitialState(slug: LifeDecisionCalculatorSlug) {
  const config = decisionCalculatorConfigs[slug];
  return config.presets[0]?.values ?? Object.fromEntries(config.factors.flatMap((factor) => [[`${factor.id}A`, ""], [`${factor.id}B`, ""], [`${factor.id}Weight`, defaultWeightForDimension(factor.dimension)]]));
}

function buildKeys(slug: LifeDecisionCalculatorSlug) {
  return decisionCalculatorConfigs[slug].factors.flatMap((factor) => [`${factor.id}A`, `${factor.id}B`, `${factor.id}Weight`]) as string[];
}

const rawScoreOptions = Array.from({ length: 11 }, (_, index) => `${index}`);
const guidedWeightOptions = [
  { value: "2", label: "Minor factor" },
  { value: "3", label: "Matters" },
  { value: "4", label: "Very important" },
  { value: "5", label: "Critical" }
];

function defaultWeightForDimension(dimension: string) {
  if (dimension === "risk") {
    return "5";
  }

  return "4";
}

function parseState(slug: LifeDecisionCalculatorSlug, state: Record<string, string>) {
  const config = decisionCalculatorConfigs[slug];
  const inputs = Object.fromEntries(
    config.factors.map((factor) => {
      const optionA = Number(state[`${factor.id}A`]);
      const optionB = Number(state[`${factor.id}B`]);
      const weight = Number(state[`${factor.id}Weight`]);
      return [factor.id, { optionA, optionB, weight }];
    })
  );

  if (Object.values(inputs).some((value) => !Number.isFinite(value.optionA) || !Number.isFinite(value.optionB) || !Number.isFinite(value.weight))) {
    return undefined;
  }

  return inputs;
}

function gaugeSegments() {
  return [
    { label: "Low", max: 4, color: "#ef4444" },
    { label: "Mixed", max: 7, color: "#f59e0b" },
    { label: "Strong", max: 10, color: "#10b981" }
  ];
}

function getSupportBand(score: number) {
  if (score >= 7) {
    return { label: "Strong support", description: "The weighted factors support this path clearly." };
  }
  if (score >= 4) {
    return { label: "Mixed case", description: "This path has meaningful tradeoffs or unresolved pressure points." };
  }
  return { label: "Weak support", description: "The weighted factors do not support this path well right now." };
}

function getRiskBand(score: number) {
  if (score >= 7) {
    return { label: "Stable enough", description: "The recommended path looks resilient against the main risks you scored." };
  }
  if (score >= 4) {
    return { label: "Some exposure", description: "The path can work, but there are still real risk flags to manage." };
  }
  return { label: "High fragility", description: "The recommended path looks exposed to downside or weak support." };
}

function answerToScores(answer: "a" | "tie" | "b") {
  if (answer === "a") {
    return { a: "8", b: "3" };
  }
  if (answer === "b") {
    return { a: "3", b: "8" };
  }
  return { a: "5", b: "5" };
}

function scoresToAnswer(a: string, b: string) {
  const left = Number(a);
  const right = Number(b);
  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    return "";
  }
  if (left >= 6.5 && right <= 4.5) {
    return "a";
  }
  if (right >= 6.5 && left <= 4.5) {
    return "b";
  }
  return "tie";
}

function getShortLabels(slug: LifeDecisionCalculatorSlug) {
  const config = decisionCalculatorConfigs[slug];
  return {
    a: config.shortOptionALabel ?? config.optionALabel,
    b: config.shortOptionBLabel ?? config.optionBLabel,
    tie: config.tieLabel ?? "Not sure"
  };
}

function getQuestionText(slug: LifeDecisionCalculatorSlug, factorLabel: string) {
  switch (slug) {
    case "quit-job-calculator":
      return `For ${factorLabel.toLowerCase()}, which answer is closer to your real situation right now?`;
    case "move-calculator":
      return `For ${factorLabel.toLowerCase()}, what does this decision point to right now?`;
    case "get-married-calculator":
      return `For ${factorLabel.toLowerCase()}, what does this relationship decision point to right now?`;
    case "have-kids-calculator":
      return `For ${factorLabel.toLowerCase()}, what does your timing decision point to right now?`;
    case "buy-a-house-readiness-calculator":
      return `For ${factorLabel.toLowerCase()}, what does your readiness point to right now?`;
    case "start-a-business-calculator":
      return `For ${factorLabel.toLowerCase()}, what does this business decision point to right now?`;
    case "go-back-to-school-calculator":
      return `For ${factorLabel.toLowerCase()}, what does the school decision point to right now?`;
    case "job-offer-calculator":
      return `For ${factorLabel.toLowerCase()}, what does this job choice point to right now?`;
    case "break-up-calculator":
      return `For ${factorLabel.toLowerCase()}, what does this relationship point to right now?`;
    case "retire-early-calculator":
      return `For ${factorLabel.toLowerCase()}, what does your retirement decision point to right now?`;
    default:
      return `For ${factorLabel.toLowerCase()}, which answer fits best right now?`;
  }
}

function getGuidedChoiceCopy(slug: LifeDecisionCalculatorSlug) {
  const config = decisionCalculatorConfigs[slug];
  const labels = getShortLabels(slug);

  const neutralDescriptions: Record<LifeDecisionCalculatorSlug, string> = {
    "quit-job-calculator": "This factor is mixed or you need more clarity before deciding.",
    "move-calculator": "This factor is too close to call or needs more clarity.",
    "get-married-calculator": "This factor feels promising but not clear enough yet.",
    "have-kids-calculator": "This factor is mixed enough that the timing still feels open.",
    "buy-a-house-readiness-calculator": "This factor does not clearly support buying or waiting yet.",
    "start-a-business-calculator": "This factor is mixed enough that more clarity may still be needed.",
    "go-back-to-school-calculator": "This factor is still mixed or unresolved.",
    "job-offer-calculator": "This factor does not clearly favor either path yet.",
    "break-up-calculator": "This factor still feels unresolved or hard to call.",
    "retire-early-calculator": "This factor is still mixed enough that the call is not clear yet."
  };

  return [
    {
      key: "a" as const,
      label: labels.a,
      description: config.optionALabel
    },
    {
      key: "tie" as const,
      label: labels.tie,
      description: neutralDescriptions[slug]
    },
    {
      key: "b" as const,
      label: labels.b,
      description: config.optionBLabel
    }
  ];
}

export function LifeDecisionCalculator({ slug }: { slug: LifeDecisionCalculatorSlug }) {
  const config = decisionCalculatorConfigs[slug];
  const initialState = useMemo(() => buildInitialState(slug), [slug]);
  const keys = useMemo(() => buildKeys(slug), [slug]);
  const [comparisonEnabled, setComparisonEnabled] = useState(false);
  const [comparisonState, setComparisonState] = useState<Record<string, string>>(initialState);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({ initialState, keys });

  const result = useMemo(() => {
    const parsed = parseState(slug, state);
    return parsed ? calculateDecisionOutcome(config, parsed) : undefined;
  }, [config, slug, state]);

  const comparisonResult = useMemo(() => {
    if (!comparisonEnabled) {
      return undefined;
    }
    const parsed = parseState(slug, comparisonState);
    return parsed ? calculateDecisionOutcome(config, parsed) : undefined;
  }, [comparisonEnabled, comparisonState, config, slug]);

  const currentFactor = config.factors[currentStep];
  const answeredCount = config.factors.filter((factor) => state[`${factor.id}A`] && state[`${factor.id}B`]).length;
  const currentAnswer = currentFactor ? scoresToAnswer(state[`${currentFactor.id}A`], state[`${currentFactor.id}B`]) : "";
  const labels = getShortLabels(slug);
  const guidedChoices = getGuidedChoiceCopy(slug);

  const recommendedPractical = result?.recommendation === "A" ? result.optionAPractical : result?.recommendation === "B" ? result.optionBPractical : Math.max(result?.optionAPractical ?? 0, result?.optionBPractical ?? 0);
  const recommendedEmotional = result?.recommendation === "A" ? result.optionAEmotional : result?.recommendation === "B" ? result.optionBEmotional : Math.max(result?.optionAEmotional ?? 0, result?.optionBEmotional ?? 0);
  const recommendedRisk = result?.recommendation === "A" ? result.optionARisk : result?.recommendation === "B" ? result.optionBRisk : Math.max(result?.optionARisk ?? 0, result?.optionBRisk ?? 0);

  const optionASupport = result ? getSupportBand(result.optionAScore) : undefined;
  const optionBSupport = result ? getSupportBand(result.optionBScore) : undefined;
  const practicalSupport = getSupportBand(recommendedPractical ?? 0);
  const emotionalSupport = getSupportBand(recommendedEmotional ?? 0);
  const riskSupport = getRiskBand(recommendedRisk ?? 0);

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="space-y-4">
          <div className="surface p-6 md:p-8">
            <div className="space-y-3">
              <p className="section-label">Guided decision flow</p>
              <h3 className="text-2xl font-semibold">One question at a time</h3>
              <p className="text-sm leading-7 text-muted">Each step gives you three specific answers for this calculator. Pick the one that fits best and the next question opens automatically.</p>
            </div>

            <div className="mt-6 rounded-3xl border border-border bg-slate-50/80 p-5 dark:bg-slate-950/30">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Step {currentStep + 1} of {config.factors.length}</p>
                <span className="rounded-full border border-border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                  {currentFactor.dimension}
                </span>
              </div>

              <div className="mt-5 space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">Current question</p>
                <h4 className="text-3xl font-semibold text-slate-950 dark:text-white">{currentFactor.label}</h4>
                <p className="text-base leading-7 text-muted">{currentFactor.description}</p>
                <p className="max-w-3xl text-xl font-semibold leading-8 text-slate-950 dark:text-white">{getQuestionText(slug, currentFactor.label)}</p>
                <p className="text-sm leading-7 text-muted">Choose the answer that fits best for this factor.</p>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {guidedChoices.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => {
                      const scores = answerToScores(option.key);
                      setState((current) => ({
                        ...current,
                        [`${currentFactor.id}A`]: scores.a,
                        [`${currentFactor.id}B`]: scores.b,
                        [`${currentFactor.id}Weight`]: defaultWeightForDimension(currentFactor.dimension)
                      }));

                      if (currentStep < config.factors.length - 1) {
                        setCurrentStep((step) => step + 1);
                      }
                    }}
                    className={cn(
                      "flex min-h-40 flex-col justify-between rounded-3xl border px-5 py-5 text-left transition",
                      currentAnswer === option.key
                        ? "border-accent bg-accent-soft text-accent shadow-sm"
                        : "border-border bg-white hover:border-accent hover:bg-slate-50 dark:bg-slate-950/40"
                    )}
                  >
                    <div className="space-y-3">
                      <p className="text-2xl font-semibold leading-8">{option.label}</p>
                      <p className="text-sm leading-6 text-muted">{option.description}</p>
                    </div>
                    <p className="pt-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted">Select to continue</p>
                  </button>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button type="button" variant="secondary" onClick={() => setCurrentStep((step) => Math.max(0, step - 1))} disabled={currentStep === 0}>
                  Previous
                </Button>
                {currentStep === config.factors.length - 1 ? (
                  <Button type="button" variant="secondary" onClick={() => setCurrentStep(0)}>
                    Back to step 1
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-border bg-white/70 px-4 py-3 text-sm text-muted dark:bg-slate-950/30">
              {answeredCount} of {config.factors.length} guided questions answered.
            </div>

            <div className="mt-6">
              <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
            </div>
          </div>

          <ExamplePresetList
            title="Try an example"
            body="Load a preset if you want to see how the guided result behaves before answering the questions yourself."
            items={config.presets.map((preset) => ({ label: preset.label, description: preset.description, onApply: () => setState(preset.values) }))}
          />

          <div className="surface p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="section-label">Advanced factors</p>
                <p className="text-sm leading-7 text-muted">Closed by default. Open this only if you want direct control over raw scores and importance.</p>
              </div>
              <Button type="button" variant="secondary" onClick={() => setShowAdvanced((current) => !current)}>
                {showAdvanced ? "Hide factors" : "Show factors"}
              </Button>
            </div>
            {showAdvanced ? (
              <div className="mt-6 space-y-4">
                {config.factors.map((factor) => (
                  <div key={factor.id} className="rounded-2xl border border-border bg-slate-50/70 p-4 dark:bg-slate-950/30">
                    <p className="text-sm font-semibold text-slate-950 dark:text-white">{factor.label}</p>
                    <div className="mt-3 grid gap-4 md:grid-cols-3">
                      <SelectField label={config.optionALabel} hint="0-10" value={state[`${factor.id}A`]} onChange={(event) => setState((current) => ({ ...current, [`${factor.id}A`]: event.target.value }))}>
                        <option value="">Score</option>
                        {rawScoreOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                      </SelectField>
                      <SelectField label={config.optionBLabel} hint="0-10" value={state[`${factor.id}B`]} onChange={(event) => setState((current) => ({ ...current, [`${factor.id}B`]: event.target.value }))}>
                        <option value="">Score</option>
                        {rawScoreOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                      </SelectField>
                      <SelectField label="Importance" hint="1-5" value={state[`${factor.id}Weight`]} onChange={(event) => setState((current) => ({ ...current, [`${factor.id}Weight`]: event.target.value }))}>
                        <option value="">Choose one</option>
                        {guidedWeightOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                      </SelectField>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <ComparisonControls
            enabled={comparisonEnabled}
            onEnable={() => {
              setComparisonEnabled(true);
              setComparisonState(state);
            }}
            onDisable={() => setComparisonEnabled(false)}
            onCopyCurrent={() => setComparisonState(state)}
            title="Compare a second scenario"
            body="Use this to test a different timing assumption, stronger support, more runway, or any other alternate version of the same decision."
          />

          {comparisonEnabled ? (
            <div className="surface p-6 md:p-8">
              <p className="text-sm leading-7 text-muted">Comparison mode stays advanced so you can test a precise alternate scenario.</p>
              <div className="mt-4 space-y-4">
                {config.factors.map((factor) => (
                  <div key={factor.id} className="grid gap-4 md:grid-cols-3">
                    <SelectField label={`${config.optionALabel} (B)`} hint={factor.label} value={comparisonState[`${factor.id}A`]} onChange={(event) => setComparisonState((current) => ({ ...current, [`${factor.id}A`]: event.target.value }))}>
                      <option value="">Score</option>
                      {rawScoreOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </SelectField>
                    <SelectField label={`${config.optionBLabel} (B)`} hint={factor.label} value={comparisonState[`${factor.id}B`]} onChange={(event) => setComparisonState((current) => ({ ...current, [`${factor.id}B`]: event.target.value }))}>
                      <option value="">Score</option>
                      {rawScoreOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </SelectField>
                    <SelectField label="Importance (B)" hint={factor.label} value={comparisonState[`${factor.id}Weight`]} onChange={(event) => setComparisonState((current) => ({ ...current, [`${factor.id}Weight`]: event.target.value }))}>
                      <option value="">Weight</option>
                      {guidedWeightOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </SelectField>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          {!result ? (
            <EmptyCalculatorState title={config.emptyStateTitle} body="Answer the guided question on the left. The recommendation becomes more useful as you move through the steps." />
          ) : (
            <>
              <div className="surface space-y-4 p-6 md:p-8">
                <div>
                  <p className="section-label">Recommendation</p>
                  <h3 className="mt-4 text-3xl font-semibold">{result.verdictLabel}</h3>
                  <p className="mt-2 text-sm leading-7">{result.confidenceLabel}. The weighted score gap is {formatNumber(Math.abs(result.gap), 2)} points on a 10-point scale.</p>
                  <p className="mt-2 text-sm leading-7 text-muted">Scores closer to 10 mean the option is better supported by the factors you said matter most. Scores near the middle mean the case is mixed, and lower scores mean the case is weak.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <ResultCard label={config.optionALabel} value={formatNumber(result.optionAScore, 2)} tone={result.recommendation === "A" ? "success" : "default"} caption={`${optionASupport?.label}: ${optionASupport?.description}`} />
                  <ResultCard label={config.optionBLabel} value={formatNumber(result.optionBScore, 2)} tone={result.recommendation === "B" ? "success" : "default"} caption={`${optionBSupport?.label}: ${optionBSupport?.description}`} />
                  <ResultCard label="Decision direction" value={result.verdictLabel} tone={result.recommendation === "tie" ? "warning" : result.verdictTone === "caution" ? "warning" : "success"} caption={result.recommendation === "tie" ? "The weighted case is close enough that the result should be treated as unresolved." : "This is the path with the stronger weighted support overall."} />
                  <ResultCard label="Risk resilience" value={recommendedRisk !== undefined ? formatNumber(recommendedRisk, 2) : "-"} tone={(recommendedRisk ?? 0) >= 6 ? "success" : "warning"} caption={`${riskSupport.label}: Higher scores mean the recommended path looks safer and more sustainable.`} />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <RangeGauge value={recommendedPractical ?? 0} min={0} max={10} title="Practical support" centerLabel={formatNumber(recommendedPractical ?? 0, 1)} unitLabel={`${practicalSupport.label} on a 0 to 10 scale`} segments={gaugeSegments()} />
                <RangeGauge value={recommendedEmotional ?? 0} min={0} max={10} title="Emotional support" centerLabel={formatNumber(recommendedEmotional ?? 0, 1)} unitLabel={`${emotionalSupport.label} on a 0 to 10 scale`} segments={gaugeSegments()} />
                <RangeGauge value={recommendedRisk ?? 0} min={0} max={10} title="Risk resilience" centerLabel={formatNumber(recommendedRisk ?? 0, 1)} unitLabel={`${riskSupport.label} on a 0 to 10 scale`} segments={gaugeSegments()} />
              </div>
              <InsightPanel title="Useful context" body={config.insight} />
              <div className="surface p-6 md:p-8">
                <p className="section-label">What is driving the result</p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-950 dark:text-white">Strongest signals</p>
                    <ul className="mt-3 space-y-2 text-sm leading-7 text-muted">
                      {result.strongestFactors.length ? result.strongestFactors.map((factor) => <li key={factor}>{factor}</li>) : <li>No factor stands out yet.</li>}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-950 dark:text-white">Caution flags</p>
                    <ul className="mt-3 space-y-2 text-sm leading-7 text-muted">
                      {result.cautionFactors.length ? result.cautionFactors.map((factor) => <li key={factor}>{factor}</li>) : <li>No major risk factors are scoring low in the recommended path.</li>}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="surface p-6 md:p-8">
                <p className="section-label">Before you act</p>
                <p className="mt-4 text-sm leading-7 text-muted">{config.caution}</p>
              </div>
              {comparisonEnabled && comparisonResult ? (
                <div className="surface space-y-4 p-6 md:p-8">
                  <div>
                    <p className="section-label">Comparison summary</p>
                    <h3 className="mt-4 text-2xl font-semibold">Scenario B versus the current setup</h3>
                    <p className="mt-2 text-sm leading-7">Scenario B changes the weighted gap by {formatNumber(Math.abs(comparisonResult.gap) - Math.abs(result.gap), 2)} and {comparisonResult.recommendation === result.recommendation ? "keeps the recommendation pointed the same way" : "changes the recommendation itself"}.</p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <ResultCard label="Scenario B recommendation" value={comparisonResult.verdictLabel} tone={comparisonResult.recommendation === result.recommendation ? "default" : "success"} caption="This is the direction the alternate scenario points once the weights are recomputed." />
                    <ResultCard label="Scenario B confidence" value={comparisonResult.confidenceLabel} caption="Higher confidence means the gap between the two options is wider." />
                    <ResultCard label="Scenario B option A" value={formatNumber(comparisonResult.optionAScore, 2)} caption={getSupportBand(comparisonResult.optionAScore).label} />
                    <ResultCard label="Scenario B option B" value={formatNumber(comparisonResult.optionBScore, 2)} caption={getSupportBand(comparisonResult.optionBScore).label} />
                  </div>
                  <DecisionSummaryPanel
                    calculator={config.title}
                    body={comparisonResult.recommendation === result.recommendation ? `Scenario B does not overturn the direction of the decision, which suggests the same core factors are still driving the outcome. Focus on the low-scoring risk factors before acting.` : `Scenario B flips the direction of the result, which means one or two assumptions are carrying the whole decision. Revisit the most heavily weighted factors before treating either answer as final.`}
                    verdict={{ label: comparisonResult.verdictLabel, tone: comparisonResult.verdictTone }}
                    highlights={comparisonResult.strongestFactors}
                    exportTitle={`${config.title} comparison`}
                  />
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
