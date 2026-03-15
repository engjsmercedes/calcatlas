"use client";

import { useMemo, useState } from "react";

import { InputField } from "@/components/ui/input-field";
import { LineChart } from "@/components/ui/line-chart";
import { ResultCard } from "@/components/ui/result-card";
import { SelectField } from "@/components/ui/select-field";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateCompoundInterest } from "@/lib/calculators/compound-interest";
import { formatCurrency, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, ComparisonControls, DecisionSummaryPanel, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const initialState = {
  initialAmount: "10000",
  contributionAmount: "500",
  contributionFrequency: "monthly",
  annualRate: "7",
  years: "20",
  compoundingFrequency: "monthly"
};

export function CompoundInterestCalculator() {
  const [comparisonEnabled, setComparisonEnabled] = useState(false);
  const [comparisonState, setComparisonState] = useState(initialState);
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["initialAmount", "contributionAmount", "contributionFrequency", "annualRate", "years", "compoundingFrequency"]
  });

  const initialAmount = parseNumberInput(state.initialAmount);
  const contributionAmount = parseNumberInput(state.contributionAmount) ?? 0;
  const annualRate = parseNumberInput(state.annualRate);
  const years = parseNumberInput(state.years);

  const result = useMemo(() => {
    if (initialAmount === undefined || annualRate === undefined || years === undefined) return undefined;
    return calculateCompoundInterest({
      initialAmount,
      contributionAmount,
      contributionFrequency: state.contributionFrequency as "monthly" | "quarterly" | "annually",
      annualRate,
      years,
      compoundingFrequency: state.compoundingFrequency as "annually" | "quarterly" | "monthly" | "daily"
    });
  }, [annualRate, contributionAmount, initialAmount, state.compoundingFrequency, state.contributionFrequency, years]);

  const comparisonResult = useMemo(() => {
    if (!comparisonEnabled) return undefined;
    const compareInitialAmount = parseNumberInput(comparisonState.initialAmount);
    const compareAnnualRate = parseNumberInput(comparisonState.annualRate);
    const compareYears = parseNumberInput(comparisonState.years);
    if (compareInitialAmount === undefined || compareAnnualRate === undefined || compareYears === undefined) return undefined;
    return calculateCompoundInterest({
      initialAmount: compareInitialAmount,
      contributionAmount: parseNumberInput(comparisonState.contributionAmount) ?? 0,
      contributionFrequency: comparisonState.contributionFrequency as "monthly" | "quarterly" | "annually",
      annualRate: compareAnnualRate,
      years: compareYears,
      compoundingFrequency: comparisonState.compoundingFrequency as "annually" | "quarterly" | "monthly" | "daily"
    });
  }, [comparisonEnabled, comparisonState]);

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="surface p-6 md:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField label="Initial amount" prefix="$" tooltip="Starting balance before any future contributions are added." value={state.initialAmount} onChange={(event) => setState((current) => ({ ...current, initialAmount: event.target.value }))} />
              <InputField label="Contribution amount" prefix="$" tooltip="Amount added at each contribution interval such as monthly or annually." value={state.contributionAmount} onChange={(event) => setState((current) => ({ ...current, contributionAmount: event.target.value }))} />
              <SelectField label="Contribution frequency" tooltip="How often new money is added to the balance." value={state.contributionFrequency} onChange={(event) => setState((current) => ({ ...current, contributionFrequency: event.target.value }))}>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </SelectField>
              <InputField label="Annual rate" hint="Expected yearly return %" tooltip="Assumed annual return before compounding is applied." value={state.annualRate} onChange={(event) => setState((current) => ({ ...current, annualRate: event.target.value }))} />
              <InputField label="Years" hint="Projection length" tooltip="Number of years the balance stays invested under the current plan." value={state.years} onChange={(event) => setState((current) => ({ ...current, years: event.target.value }))} />
              <SelectField label="Compounding frequency" hint="Short timelines usually change only a little" tooltip="How often returns are added back into the balance. This usually matters more over long periods than short ones." value={state.compoundingFrequency} onChange={(event) => setState((current) => ({ ...current, compoundingFrequency: event.target.value }))}>
                <option value="annually">Annually</option>
                <option value="quarterly">Quarterly</option>
                <option value="monthly">Monthly</option>
                <option value="daily">Daily</option>
              </SelectField>
            </div>
            <div className="mt-6 space-y-4">
              <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
              <InsightPanel title="How compounding frequency works" body="Compounding frequency controls how often returns get added back into the balance. Over short periods, or when most money is contributed gradually across the year, the difference between annual, monthly, and daily compounding is usually small. It becomes more noticeable over longer timelines, larger balances, and higher rates." />
            </div>
          </div>
          <ExamplePresetList
            title="Try an example"
            body="Use a preset scenario to see how time horizon and compounding assumptions change the outcome in practice."
            items={[
              { label: "Short-term savings", description: "$1,000 upfront, $500 monthly, 7% for 1 year. Good for seeing why compounding frequency barely moves on short timelines.", onApply: () => setState({ initialAmount: "1000", contributionAmount: "500", contributionFrequency: "monthly", annualRate: "7", years: "1", compoundingFrequency: "annually" }) },
              { label: "Long-term investing", description: "$10,000 upfront, $500 monthly, 7% for 20 years. Better for seeing how compounding and time start to matter together.", onApply: () => setState({ initialAmount: "10000", contributionAmount: "500", contributionFrequency: "monthly", annualRate: "7", years: "20", compoundingFrequency: "monthly" }) }
            ]}
          />
          <ComparisonControls
            enabled={comparisonEnabled}
            onEnable={() => {
              setComparisonEnabled(true);
              setComparisonState(state);
            }}
            onDisable={() => setComparisonEnabled(false)}
            onCopyCurrent={() => setComparisonState(state)}
            title="Compare two growth plans"
            body="Compare balances, contributions, and interest across two contribution and return scenarios."
          />
          {comparisonEnabled ? (
            <div className="surface p-6 md:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField label="Compare initial amount" prefix="$" value={comparisonState.initialAmount} onChange={(event) => setComparisonState((current) => ({ ...current, initialAmount: event.target.value }))} />
                <InputField label="Compare contribution amount" prefix="$" value={comparisonState.contributionAmount} onChange={(event) => setComparisonState((current) => ({ ...current, contributionAmount: event.target.value }))} />
                <SelectField label="Compare contribution frequency" value={comparisonState.contributionFrequency} onChange={(event) => setComparisonState((current) => ({ ...current, contributionFrequency: event.target.value }))}>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </SelectField>
                <InputField label="Compare annual rate" hint="Expected yearly return %" value={comparisonState.annualRate} onChange={(event) => setComparisonState((current) => ({ ...current, annualRate: event.target.value }))} />
                <InputField label="Compare years" value={comparisonState.years} onChange={(event) => setComparisonState((current) => ({ ...current, years: event.target.value }))} />
                <SelectField label="Compare compounding frequency" value={comparisonState.compoundingFrequency} onChange={(event) => setComparisonState((current) => ({ ...current, compoundingFrequency: event.target.value }))}>
                  <option value="annually">Annually</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="monthly">Monthly</option>
                  <option value="daily">Daily</option>
                </SelectField>
              </div>
            </div>
          ) : null}
        </div>
        <div className="space-y-4">
          {!result ? (
            <EmptyCalculatorState title="Add the core inputs" body="Start with your initial amount, expected rate, contribution plan, and time horizon. The calculator will project the balance instantly." />
          ) : (
            <>
              <div className="surface space-y-4 p-6 md:p-8">
                <div>
                  <p className="section-label">Future value</p>
                  <h3 className="mt-4 text-2xl font-semibold">{formatCurrency(result.finalBalance)}</h3>
                  <p className="mt-2 text-sm leading-7">Over {state.years} years, total contributions of {formatCurrency(result.totalContributions)} could grow into {formatCurrency(result.finalBalance)} based on the inputs above.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <ResultCard label="Final balance" value={formatCurrency(result.finalBalance)} tone="success" />
                  <ResultCard label="Total contributions" value={formatCurrency(result.totalContributions)} />
                  <ResultCard label="Total interest" value={formatCurrency(result.totalInterest)} />
                </div>
              </div>
              <InsightPanel title="Growth insight" body={`If you invest ${formatCurrency(contributionAmount)} ${state.contributionFrequency} at ${state.annualRate}% annually, your balance could reach ${formatCurrency(result.finalBalance)} in ${state.years} years. The chart also compares growth against cash contributed.`} />
              {comparisonEnabled && comparisonResult ? (
                <div className="surface space-y-4 p-6 md:p-8">
                  <div>
                    <p className="section-label">Comparison summary</p>
                    <h3 className="mt-4 text-2xl font-semibold">How the second growth plan compares</h3>
                    <p className="mt-2 text-sm leading-7">The comparison plan changes final balance by {formatCurrency(comparisonResult.finalBalance - result.finalBalance)}, total interest by {formatCurrency(comparisonResult.totalInterest - result.totalInterest)}, and cash contributions by {formatCurrency(comparisonResult.totalContributions - result.totalContributions)}.</p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <ResultCard label="Scenario B final balance" value={formatCurrency(comparisonResult.finalBalance)} />
                    <ResultCard label="Balance delta" value={formatCurrency(comparisonResult.finalBalance - result.finalBalance)} tone={comparisonResult.finalBalance >= result.finalBalance ? "success" : "default"} />
                    <ResultCard label="Interest delta" value={formatCurrency(comparisonResult.totalInterest - result.totalInterest)} tone={comparisonResult.totalInterest >= result.totalInterest ? "success" : "default"} />
                  </div>
                  <DecisionSummaryPanel calculator="Compound interest calculator" body={comparisonResult.finalBalance >= result.finalBalance && comparisonResult.totalContributions <= result.totalContributions ? `Scenario B is more capital-efficient: it finishes with a larger balance while asking for no more cash along the way.` : comparisonResult.finalBalance >= result.finalBalance ? `Scenario B builds a larger ending balance, but part of that gain comes from contributing more cash. It is the better choice only if the extra saving fits your budget.` : comparisonResult.totalContributions < result.totalContributions ? `Scenario B preserves more monthly cash flow, but it gives up end-balance growth. It is the better fit when flexibility matters more than maximum long-term value.` : `The primary plan remains the stronger wealth-building option because it turns the same or less cash into a better long-term balance.`} />
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
      {result ? (
        <LineChart labels={result.points.map((point) => point.year)} series={[{ label: "Projected balance", color: "#0891b2", values: result.points.map((point) => point.balance) }, { label: "Total cash invested", color: "#94a3b8", values: result.points.map((point) => point.contributions) }]} />
      ) : null}
    </div>
  );
}






