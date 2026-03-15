"use client";

import { useMemo, useState } from "react";

import { InputField } from "@/components/ui/input-field";
import { LineChart } from "@/components/ui/line-chart";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { amortizedMonthlyPayment, calculateLoan, solveAnnualRateFromPayment } from "@/lib/calculators/borrowing";
import { formatCurrency, formatNumber, parseNumberInput, parsePositiveNumberInput } from "@/lib/utils";

import { CalculatorActions, ComparisonControls, DecisionSummaryPanel, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const initialState = {
  amount: "25000",
  annualRate: "7.2",
  targetMonthlyPayment: "",
  years: "5",
  extraPaymentMonthly: ""
};

function solveLoanAmount(monthlyPayment: number, annualRate: number, years: number) {
  const months = Math.round(years * 12);
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyPayment <= 0 || annualRate < 0 || months <= 0) return undefined;
  if (monthlyRate === 0) return monthlyPayment * months;
  const denominator = (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  if (denominator <= 0) return undefined;
  return monthlyPayment / denominator;
}

function solveLoanYears(amount: number, annualRate: number, monthlyPayment: number) {
  const monthlyRate = annualRate / 100 / 12;
  if (amount <= 0 || annualRate < 0 || monthlyPayment <= 0) return undefined;
  if (monthlyRate === 0) return amount / monthlyPayment / 12;
  if (monthlyPayment <= amount * monthlyRate) return undefined;
  const months = -Math.log(1 - (monthlyRate * amount) / monthlyPayment) / Math.log(1 + monthlyRate);
  return months / 12;
}

function formatMonths(months: number) {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (years === 0) return `${remainingMonths} months`;
  if (remainingMonths === 0) return `${years} years`;
  return `${years} years ${remainingMonths} months`;
}

function formatLoanTerm(years: number) {
  return formatMonths(Math.max(1, Math.round(years * 12)));
}

function resolveLoanCore(inputs: { amount?: number; annualRate?: number; years?: number; monthlyPayment?: number }) {
  const { amount, annualRate, years, monthlyPayment } = inputs;
  const providedCount = [amount, annualRate, years, monthlyPayment].filter((value) => value !== undefined).length;
  if (providedCount < 3) return undefined;

  let resolvedAmount = amount;
  let resolvedAnnualRate = annualRate;
  let resolvedYears = years;
  let resolvedMonthlyPayment = monthlyPayment;
  let solvedField: "amount" | "annualRate" | "years" | "monthlyPayment" | "none" = "none";
  let solvedBy = "all inputs";

  if (resolvedAmount === undefined) {
    if (resolvedAnnualRate === undefined || resolvedYears === undefined || resolvedMonthlyPayment === undefined) return undefined;
    const solved = solveLoanAmount(resolvedMonthlyPayment, resolvedAnnualRate, resolvedYears);
    if (solved === undefined || solved <= 0) return { error: "These inputs do not produce a valid loan amount." };
    resolvedAmount = solved;
    solvedField = "amount";
    solvedBy = "rate, term, and payment";
  } else if (resolvedAnnualRate === undefined) {
    if (resolvedYears === undefined || resolvedMonthlyPayment === undefined) return undefined;
    const solved = solveAnnualRateFromPayment(resolvedAmount, resolvedMonthlyPayment, Math.round(resolvedYears * 12));
    if (solved === undefined || solved < 0) return { error: "That payment is too low for this amount and term, so there is no valid positive rate to solve for." };
    resolvedAnnualRate = solved;
    solvedField = "annualRate";
    solvedBy = "amount, term, and payment";
  } else if (resolvedYears === undefined) {
    if (resolvedMonthlyPayment === undefined) return undefined;
    const solved = solveLoanYears(resolvedAmount, resolvedAnnualRate, resolvedMonthlyPayment);
    if (solved === undefined || !Number.isFinite(solved) || solved <= 0) return { error: "That payment is too low to fully amortize the balance at this rate." };
    resolvedYears = solved;
    solvedField = "years";
    solvedBy = "amount, rate, and payment";
  } else if (resolvedMonthlyPayment === undefined) {
    resolvedMonthlyPayment = amortizedMonthlyPayment(resolvedAmount, resolvedAnnualRate, Math.round(resolvedYears * 12));
    solvedField = "monthlyPayment";
    solvedBy = "amount, rate, and term";
  }

  if (resolvedAmount === undefined || resolvedAnnualRate === undefined || resolvedYears === undefined || resolvedMonthlyPayment === undefined) return undefined;
  const expectedPayment = amortizedMonthlyPayment(resolvedAmount, resolvedAnnualRate, Math.round(resolvedYears * 12));
  if (Math.abs(expectedPayment - resolvedMonthlyPayment) > 0.5) return { error: "These core loan inputs conflict with each other. Clear one field or adjust the amount, rate, term, and payment so they agree." };

  return { amount: resolvedAmount, annualRate: resolvedAnnualRate, years: resolvedYears, monthlyPayment: resolvedMonthlyPayment, solvedField, solvedBy };
}

export function LoanCalculator() {
  const [comparisonEnabled, setComparisonEnabled] = useState(false);
  const [comparisonState, setComparisonState] = useState(initialState);
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["amount", "annualRate", "targetMonthlyPayment", "years", "extraPaymentMonthly"]
  });

  const amount = parsePositiveNumberInput(state.amount);
  const annualRate = parsePositiveNumberInput(state.annualRate);
  const targetMonthlyPayment = parsePositiveNumberInput(state.targetMonthlyPayment);
  const years = parsePositiveNumberInput(state.years);
  const extraPaymentMonthly = parseNumberInput(state.extraPaymentMonthly) ?? 0;

  const resolved = useMemo(() => resolveLoanCore({ amount, annualRate, years, monthlyPayment: targetMonthlyPayment }), [amount, annualRate, targetMonthlyPayment, years]);
  const result = useMemo(() => {
    if (!resolved || "error" in resolved) return undefined;
    return calculateLoan({ amount: resolved.amount, annualRate: resolved.annualRate, years: resolved.years, extraPaymentMonthly });
  }, [extraPaymentMonthly, resolved]);

  const comparisonResolved = useMemo(() => {
    if (!comparisonEnabled) return undefined;
    return resolveLoanCore({
      amount: parsePositiveNumberInput(comparisonState.amount),
      annualRate: parsePositiveNumberInput(comparisonState.annualRate),
      years: parsePositiveNumberInput(comparisonState.years),
      monthlyPayment: parsePositiveNumberInput(comparisonState.targetMonthlyPayment)
    });
  }, [comparisonEnabled, comparisonState]);

  const comparisonResult = useMemo(() => {
    if (!comparisonEnabled || !comparisonResolved || "error" in comparisonResolved) return undefined;
    return calculateLoan({
      amount: comparisonResolved.amount,
      annualRate: comparisonResolved.annualRate,
      years: comparisonResolved.years,
      extraPaymentMonthly: parseNumberInput(comparisonState.extraPaymentMonthly) ?? 0
    });
  }, [comparisonEnabled, comparisonResolved, comparisonState.extraPaymentMonthly]);

  const solvedField = resolved && !("error" in resolved) ? resolved.solvedField : undefined;

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="surface p-6 md:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField label="Loan amount" hint="Required core field" tooltip="Original balance before any extra payments." prefix="$" highlighted={solvedField === "amount"} value={state.amount} onChange={(event) => setState((current) => ({ ...current, amount: event.target.value }))} />
              <InputField label="Interest rate" hint="Annual %" tooltip="Nominal yearly loan rate. Leave blank to solve for the implied rate." highlighted={solvedField === "annualRate"} value={state.annualRate} onChange={(event) => setState((current) => ({ ...current, annualRate: event.target.value }))} />
              <InputField label="Loan term" hint="Years" tooltip="Repayment term in years. Leave blank to solve for the needed payoff time." highlighted={solvedField === "years"} value={state.years} onChange={(event) => setState((current) => ({ ...current, years: event.target.value }))} />
              <InputField label="Monthly payment" prefix="$" hint="Base payment before extras" tooltip="Scheduled monthly payment before any optional extra principal." highlighted={solvedField === "monthlyPayment"} value={state.targetMonthlyPayment} onChange={(event) => setState((current) => ({ ...current, targetMonthlyPayment: event.target.value }))} />
              <InputField label="Extra payment" prefix="$" hint="Monthly" value={state.extraPaymentMonthly} onChange={(event) => setState((current) => ({ ...current, extraPaymentMonthly: event.target.value }))} />
            </div>
            <p className="mt-4 text-sm leading-7 text-muted">Enter any three core loan fields and leave the fourth blank. The calculator solves the missing amount, rate, term, or scheduled payment, then compares the standard payoff against any extra monthly payment you add.</p>
            <div className="mt-6">
              <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
            </div>
          </div>
          <ExamplePresetList
            title="Try an example"
            body="Use a preset to solve for a missing payment, rate, or term before comparing the effect of extra principal."
            items={[
              { label: "Solve monthly payment", description: "A standard $25,000 personal loan at 7.2% over 5 years.", onApply: () => setState({ amount: "25000", annualRate: "7.2", targetMonthlyPayment: "", years: "5", extraPaymentMonthly: "" }) },
              { label: "Solve rate from payment", description: "Back into the implied rate from a $497.97 payment on a $25,000, 5-year loan.", onApply: () => setState({ amount: "25000", annualRate: "", targetMonthlyPayment: "497.97", years: "5", extraPaymentMonthly: "" }) },
              { label: "Solve term from payment", description: "Estimate how long a $550 payment would take to pay off a $25,000 loan at 7.2%.", onApply: () => setState({ amount: "25000", annualRate: "7.2", targetMonthlyPayment: "550", years: "", extraPaymentMonthly: "" }) }
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
            title="Compare two loan setups"
            body="Compare total interest, monthly payment, and payoff timing across two loan scenarios without replacing the main one."
          />
          {comparisonEnabled ? (
            <div className="surface p-6 md:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField label="Compare amount" prefix="$" value={comparisonState.amount} onChange={(event) => setComparisonState((current) => ({ ...current, amount: event.target.value }))} />
                <InputField label="Compare rate" hint="Annual %" value={comparisonState.annualRate} onChange={(event) => setComparisonState((current) => ({ ...current, annualRate: event.target.value }))} />
                <InputField label="Compare term" hint="Years" value={comparisonState.years} onChange={(event) => setComparisonState((current) => ({ ...current, years: event.target.value }))} />
                <InputField label="Compare monthly payment" prefix="$" value={comparisonState.targetMonthlyPayment} onChange={(event) => setComparisonState((current) => ({ ...current, targetMonthlyPayment: event.target.value }))} />
                <InputField label="Compare extra payment" prefix="$" hint="Monthly" value={comparisonState.extraPaymentMonthly} onChange={(event) => setComparisonState((current) => ({ ...current, extraPaymentMonthly: event.target.value }))} />
              </div>
            </div>
          ) : null}
        </div>
        <div className="space-y-4">
          {!resolved ? (
            <EmptyCalculatorState title="Enter any 3 core loan inputs" body="Use any three of these four core fields: loan amount, interest rate, loan term, and scheduled monthly payment. Extra payment is handled separately as an accelerated payoff choice." />
          ) : "error" in resolved ? (
            <EmptyCalculatorState title="Inputs conflict" body={resolved.error ?? "The entered values conflict with each other."} />
          ) : !result ? (
            <EmptyCalculatorState title="Enter your loan basics" body="Add enough core information to solve the loan, then use the extra payment field to compare a faster payoff scenario." />
          ) : (
            <>
              <div className="surface space-y-4 p-6 md:p-8">
                <div>
                  <p className="section-label">Loan summary</p>
                  <h3 className="mt-4 text-3xl font-semibold">{formatCurrency(result.monthlyPayment)} / month</h3>
                  <p className="mt-2 text-sm leading-7">Solved from {resolved.solvedBy}, this loan carries {formatCurrency(result.totalInterest)} in interest over {formatLoanTerm(resolved.years)} before extra payments are applied.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <ResultCard label={resolved.solvedField === "amount" ? "Solved loan amount" : "Loan amount"} value={formatCurrency(resolved.amount)} />
                  <ResultCard label={resolved.solvedField === "annualRate" ? "Solved interest rate" : "Interest rate"} value={`${formatNumber(resolved.annualRate, 3)}%`} />
                  <ResultCard label={resolved.solvedField === "years" ? "Solved loan term" : "Loan term"} value={formatLoanTerm(resolved.years)} />
                  <ResultCard label={resolved.solvedField === "monthlyPayment" ? "Solved monthly payment" : "Monthly payment"} value={formatCurrency(result.monthlyPayment)} tone="success" />
                  <ResultCard label="Total interest" value={formatCurrency(result.totalInterest)} />
                  <ResultCard label="Total paid" value={formatCurrency(result.totalPaid)} />
                </div>
              </div>
              <div className="surface space-y-4 p-6 md:p-8">
                <div>
                  <p className="section-label">Extra payment comparison</p>
                  <h3 className="mt-4 text-2xl font-semibold">{formatCurrency(result.acceleratedMonthlyPayment)} / month</h3>
                  <p className="mt-2 text-sm leading-7">Adding {formatCurrency(extraPaymentMonthly)} per month could cut about {formatMonths(result.monthsSaved)} off the payoff schedule and save {formatCurrency(result.interestSaved)} in interest.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <ResultCard label="Accelerated payoff" value={formatMonths(result.acceleratedPayoffMonths)} tone="success" />
                  <ResultCard label="Interest with extra" value={formatCurrency(result.acceleratedInterest)} />
                  <ResultCard label="Interest saved" value={formatCurrency(result.interestSaved)} />
                  <ResultCard label="Months saved" value={formatNumber(result.monthsSaved, 0)} />
                </div>
              </div>
              <InsightPanel title="Useful context" body={resolved.solvedField === "annualRate" ? `Reverse-solving the rate is useful when you know the amount, payment, and term from a quote but not the real APR-equivalent interest rate behind it.` : resolved.solvedField === "years" ? `At ${formatNumber(resolved.annualRate, 3)}%, a payment of ${formatCurrency(result.monthlyPayment)} would take about ${formatLoanTerm(resolved.years)} to fully amortize this balance.` : resolved.solvedField === "amount" ? `At ${formatNumber(resolved.annualRate, 3)}% over ${formatLoanTerm(resolved.years)}, a scheduled payment of ${formatCurrency(result.monthlyPayment)} supports borrowing about ${formatCurrency(resolved.amount)}.` : `Extra principal payments matter most early in the loan, when interest takes up a bigger share of each payment. Even a modest recurring extra payment can shorten the term more than many borrowers expect.`} />
              {comparisonEnabled ? (!comparisonResolved ? <EmptyCalculatorState title="Set the comparison loan" body="Use any three of the four core fields in the comparison scenario to see side-by-side deltas." /> : "error" in comparisonResolved || !comparisonResult ? <EmptyCalculatorState title="Comparison inputs conflict" body={"error" in comparisonResolved ? comparisonResolved.error ?? "The comparison values conflict with each other." : "Add enough comparison inputs to calculate the second scenario."} /> : (
                <div className="surface space-y-4 p-6 md:p-8">
                  <div>
                    <p className="section-label">Comparison summary</p>
                    <h3 className="mt-4 text-2xl font-semibold">How the second loan changes the outcome</h3>
                    <p className="mt-2 text-sm leading-7">Compared with the primary scenario, the second option changes monthly payment by {formatCurrency(comparisonResult.monthlyPayment - result.monthlyPayment)}, total interest by {formatCurrency(comparisonResult.totalInterest - result.totalInterest)}, and payoff time by {formatNumber((comparisonResult.acceleratedPayoffMonths - result.acceleratedPayoffMonths) / 12, 1)} years.</p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <ResultCard label="Scenario B monthly payment" value={formatCurrency(comparisonResult.monthlyPayment)} />
                    <ResultCard label="Monthly delta" value={formatCurrency(comparisonResult.monthlyPayment - result.monthlyPayment)} tone={comparisonResult.monthlyPayment <= result.monthlyPayment ? "success" : "default"} />
                    <ResultCard label="Scenario B total interest" value={formatCurrency(comparisonResult.totalInterest)} />
                    <ResultCard label="Interest delta" value={formatCurrency(comparisonResult.totalInterest - result.totalInterest)} tone={comparisonResult.totalInterest <= result.totalInterest ? "success" : "default"} />
                    <ResultCard label="Scenario B accelerated payoff" value={formatMonths(comparisonResult.acceleratedPayoffMonths)} />
                    <ResultCard label="Payoff delta" value={`${formatNumber((comparisonResult.acceleratedPayoffMonths - result.acceleratedPayoffMonths) / 12, 1)} years`} tone={comparisonResult.acceleratedPayoffMonths <= result.acceleratedPayoffMonths ? "success" : "default"} />
                  </div>
                  <DecisionSummaryPanel calculator="Loan calculator" body={comparisonResult.monthlyPayment <= result.monthlyPayment && comparisonResult.totalInterest <= result.totalInterest ? `Scenario B is stronger on both monthly cash flow and long-term borrowing cost, making it the cleaner loan structure if the assumptions are realistic.` : comparisonResult.monthlyPayment <= result.monthlyPayment ? `Scenario B is easier on monthly cash flow, but it gives up some long-term cost efficiency. It is the better fit only if payment flexibility matters more than total interest.` : comparisonResult.totalInterest <= result.totalInterest || comparisonResult.acceleratedPayoffMonths <= result.acceleratedPayoffMonths ? `Scenario B costs less over the life of the loan and pays down faster, but it asks for more cash flow each month. It is the stronger choice when long-term cost matters more than near-term budget room.` : `The primary scenario remains the more balanced option. Scenario B asks for more cash flow without improving total borrowing cost enough to justify the tradeoff.`} />
                </div>
              )) : null}
            </>
          )}
        </div>
      </div>
      {result ? (
        <LineChart labels={result.standardPoints.map((point) => point.year)} series={[{ label: "Standard balance", color: "#0891b2", values: result.standardPoints.map((point) => point.remainingBalance) }, { label: "With extra payment", color: "#10b981", values: result.acceleratedPoints.map((point) => point.remainingBalance) }]} />
      ) : null}
    </div>
  );
}






