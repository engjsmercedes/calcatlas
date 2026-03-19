"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { chanceCalculatorUiConfigs, type ChanceCalculatorSlug } from "@/data/chance-calculator-config";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { ResultCard } from "@/components/ui/result-card";
import { SelectField } from "@/components/ui/select-field";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { formatNumber, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const diceOptions = [4, 6, 8, 10, 12, 20];
const yesNoOptions = ["Yes", "No"];
const coinOptions = ["Heads", "Tails"];

function randomFrom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function buildInitialState(slug: ChanceCalculatorSlug): Record<string, string> {
  switch (slug) {
    case "dice-roller":
      return { sides: "6", quantity: "2" } as Record<string, string>;
    case "random-number-generator":
      return { min: "1", max: "100" } as Record<string, string>;
    case "random-choice-picker":
      return { options: "Pizza\nTacos\nSushi\nBurgers" } as Record<string, string>;
    default:
      return {} as Record<string, string>;
  }
}

function buildKeys(slug: ChanceCalculatorSlug) {
  switch (slug) {
    case "dice-roller":
      return ["sides", "quantity"];
    case "random-number-generator":
      return ["min", "max"];
    case "random-choice-picker":
      return ["options"];
    default:
      return [];
  }
}

export function ChanceCalculator({ slug }: { slug: ChanceCalculatorSlug }) {
  const config = chanceCalculatorUiConfigs[slug];
  const initialState = useMemo(() => buildInitialState(slug), [slug]);
  const keys = useMemo(() => buildKeys(slug), [slug]);
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({ initialState, keys });
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayValue, setDisplayValue] = useState<string>("");
  const [secondaryValue, setSecondaryValue] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  const choiceOptions = useMemo(
    () =>
      (state.options ?? "")
        .split(/[\n,]+/)
        .map((item) => item.trim())
        .filter(Boolean),
    [state.options]
  );

  const canRun =
    config.mode === "number"
      ? parseNumberInput(state.min ?? "") !== undefined && parseNumberInput(state.max ?? "") !== undefined
      : config.mode === "choice"
        ? choiceOptions.length >= 2
        : true;

  const runAnimation = (resolver: () => { value: string; secondary?: string }) => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }

    setIsAnimating(true);

    timerRef.current = window.setInterval(() => {
      const draft = resolver();
      setDisplayValue(draft.value);
      setSecondaryValue(draft.secondary ?? "");
    }, 85);

    window.setTimeout(() => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }

      const finalResult = resolver();
      setDisplayValue(finalResult.value);
      setSecondaryValue(finalResult.secondary ?? "");
      setHistory((current) => [finalResult.secondary ? `${finalResult.value} (${finalResult.secondary})` : finalResult.value, ...current].slice(0, 6));
      setIsAnimating(false);
    }, 1200);
  };

  const handleRun = () => {
    if (!canRun) {
      return;
    }

    switch (config.mode) {
      case "coin":
        runAnimation(() => ({ value: randomFrom(coinOptions) }));
        break;
      case "yes-no":
        runAnimation(() => ({ value: randomFrom(yesNoOptions) }));
        break;
      case "dice": {
        runAnimation(() => {
          const sides = Number(state.sides || 6);
          const quantity = Number(state.quantity || 1);
          const values = Array.from({ length: quantity }, () => Math.floor(Math.random() * sides) + 1);
          return { value: `${values.reduce((sum, item) => sum + item, 0)}`, secondary: values.join(" + ") };
        });
        break;
      }
      case "number": {
        runAnimation(() => {
          const min = Number(state.min);
          const max = Number(state.max);
          const lower = Math.min(min, max);
          const upper = Math.max(min, max);
          const value = Math.floor(Math.random() * (upper - lower + 1)) + lower;
          return { value: `${value}`, secondary: `Range ${lower}-${upper}` };
        });
        break;
      }
      case "choice":
        runAnimation(() => ({ value: randomFrom(choiceOptions) }));
        break;
    }
  };

  const titleLabel =
    config.mode === "coin"
      ? "Coin result"
      : config.mode === "yes-no"
        ? "Answer"
        : config.mode === "dice"
          ? "Roll total"
          : config.mode === "number"
            ? "Generated number"
            : "Selected option";

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
        <div className="space-y-4">
          <div className="surface p-6 md:p-8">
            <div className="space-y-4">
              {config.mode === "dice" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <SelectField label="Die type" value={state.sides} onChange={(event) => setState((current) => ({ ...current, sides: event.target.value }))}>
                    {diceOptions.map((option) => (
                      <option key={option} value={`${option}`}>{`d${option}`}</option>
                    ))}
                  </SelectField>
                  <SelectField label="How many dice" value={state.quantity} onChange={(event) => setState((current) => ({ ...current, quantity: event.target.value }))}>
                    {[1, 2, 3, 4, 5].map((option) => (
                      <option key={option} value={`${option}`}>{option}</option>
                    ))}
                  </SelectField>
                </div>
              ) : null}
              {config.mode === "number" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField label="Minimum" value={state.min} onChange={(event) => setState((current) => ({ ...current, min: event.target.value }))} />
                  <InputField label="Maximum" value={state.max} onChange={(event) => setState((current) => ({ ...current, max: event.target.value }))} />
                </div>
              ) : null}
              {config.mode === "choice" ? (
                <label className="block space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">Options</span>
                    <span className="text-xs text-muted">Comma or new line separated</span>
                  </div>
                  <textarea
                    className="min-h-[180px] w-full rounded-3xl border border-border bg-white/90 px-4 py-4 text-sm outline-none transition focus:border-accent dark:bg-slate-950/40"
                    value={state.options}
                    onChange={(event) => setState((current) => ({ ...current, options: event.target.value }))}
                  />
                </label>
              ) : null}
              <div className="flex flex-wrap gap-3">
                <Button type="button" onClick={handleRun} disabled={!canRun || isAnimating}>
                  {isAnimating ? `${config.animationLabel}...` : config.mode === "coin" ? "Flip" : config.mode === "yes-no" ? "Ask" : config.mode === "dice" ? "Roll" : config.mode === "number" ? "Generate" : "Pick"}
                </Button>
              </div>
            </div>
            <div className="mt-6">
              <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues || config.mode === "coin" || config.mode === "yes-no"} />
            </div>
          </div>
          <ExamplePresetList
            title="Try an example"
            body="Use a quick preset, then run the animation to see how the chance tool behaves."
            items={
              config.mode === "dice"
                ? [
                    { label: "2d6 board roll", description: "Classic two-dice roll for movement or totals.", onApply: () => setState({ sides: "6", quantity: "2" }) },
                    { label: "Single d20", description: "One large die for checks and one-shot rolls.", onApply: () => setState({ sides: "20", quantity: "1" }) }
                  ]
                : config.mode === "number"
                  ? [
                      { label: "1 to 100", description: "Classic random integer draw from a wide range.", onApply: () => setState({ min: "1", max: "100" }) },
                      { label: "50 to 75", description: "Mid-range draw when you need a tighter band.", onApply: () => setState({ min: "50", max: "75" }) }
                    ]
                  : config.mode === "choice"
                    ? [
                        { label: "Dinner picker", description: "Pick from four dinner options.", onApply: () => setState({ options: "Pizza\nTacos\nSushi\nBurgers" }) },
                        { label: "Task owner", description: "Pick one person from a small team list.", onApply: () => setState({ options: "Alex\nJordan\nSam\nTaylor" }) }
                      ]
                    : [
                        { label: "Quick tie-breaker", description: "Use a single run for a low-stakes call.", onApply: reset },
                        { label: "Best of several", description: "Run it a few times and review the recent history.", onApply: reset }
                      ]
            }
          />
          <InsightPanel
            title="Randomizer note"
            body={
              config.mode === "choice"
                ? "This works best when the options are all genuinely acceptable. If one option would still make you unhappy after it wins, that reaction is often useful information by itself."
                : "Chance tools are best for low-stakes decisions, games, and tie-breakers. If the outcome feels wrong the moment it lands, that reaction is often a useful signal too."
            }
          />
        </div>
        <div className="space-y-4">
          {!displayValue ? (
            <EmptyCalculatorState title="Run the randomizer" body="Use the controls and trigger the animation to land on a final random result." />
          ) : (
            <>
              <div className="surface space-y-5 p-6 md:p-8">
                <div>
                  <p className="section-label">Live result</p>
                  <h3 className={`mt-4 text-5xl font-semibold tracking-tight transition duration-200 ${isAnimating ? "scale-105 text-accent" : "text-slate-950 dark:text-white"}`}>{displayValue}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {isAnimating ? `${config.animationLabel} through possible outcomes before landing.` : secondaryValue || "The latest random result is shown here."}
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <ResultCard label={titleLabel} value={displayValue} tone="success" caption={config.mode === "coin" ? "A single 50/50 outcome." : config.mode === "yes-no" ? "A direct binary answer." : config.mode === "dice" ? "Total across the current roll." : config.mode === "number" ? "Random integer inside the chosen range." : "One option selected from the current list."} />
                  <ResultCard label="Animation state" value={isAnimating ? config.animationLabel : "Settled"} caption={isAnimating ? "The result is still cycling." : "The current outcome has fully landed."} />
                </div>
              </div>
              <div className="surface p-6 md:p-8">
                <p className="section-label">Recent results</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {history.map((item) => (
                    <span key={item} className="rounded-full border border-border bg-white px-4 py-2 text-sm dark:bg-slate-950/40">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

