"use client";

import { useMemo, useState } from "react";

import { InputField } from "@/components/ui/input-field";
import { LineChart } from "@/components/ui/line-chart";
import { PillTabs } from "@/components/ui/pill-tabs";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { amortizedMonthlyPayment } from "@/lib/calculators/borrowing";
import { calculateMortgage, solveMortgageAnnualRate } from "@/lib/calculators/mortgage";
import { formatCurrency, formatNumber, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, ComparisonControls, DecisionSummaryPanel, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const initialState = {
  loanAmount: "400000",
  annualRate: "6.5",
  targetPrincipalInterest: "",
  years: "30",
  propertyTaxAnnual: "4800",
  insuranceAnnual: "1800",
  hoaMonthly: "0",
  pmiMonthly: "0",
  extraMonthlyPayment: "0"
};

function solveMortgageAmount(monthlyPayment: number, annualRate: number, years: number) {
  const months = Math.round(years * 12);
  const monthlyRate = annualRate / 100 / 12;

  if (monthlyPayment <= 0 || annualRate < 0 || months <= 0) {
    return undefined;
  }

  if (monthlyRate === 0) {
    return monthlyPayment * months;
  }

  const denominator = (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);

  if (denominator <= 0) {
    return undefined;
  }

  return monthlyPayment / denominator;
}

function solveMortgageYears(loanAmount: number, annualRate: number, monthlyPayment: number) {
  const monthlyRate = annualRate / 100 / 12;

  if (loanAmount <= 0 || annualRate < 0 || monthlyPayment <= 0) {
    return undefined;
  }

  if (monthlyRate === 0) {
    return loanAmount / monthlyPayment / 12;
  }

  if (monthlyPayment <= loanAmount * monthlyRate) {
    return undefined;
  }

  const months = -Math.log(1 - (monthlyRate * loanAmount) / monthlyPayment) / Math.log(1 + monthlyRate);
  return months / 12;
}

function formatLoanTerm(years: number) {
  const totalMonths = Math.max(1, Math.round(years * 12));
  const wholeYears = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;

  if (remainingMonths === 0) {
    return `${wholeYears} years`;
  }

  return `${wholeYears} years ${remainingMonths} months`;
}

function resolveMortgageCore(inputs: {
  loanAmount?: number;
  annualRate?: number;
  years?: number;
  principalInterest?: number;
}) {
  const { loanAmount, annualRate, years, principalInterest } = inputs;
  const providedCount = [loanAmount, annualRate, years, principalInterest].filter((value) => value !== undefined).length;

  if (providedCount < 3) {
    return undefined;
  }

  let resolvedLoanAmount = loanAmount;
  let resolvedAnnualRate = annualRate;
  let resolvedYears = years;
  let resolvedPrincipalInterest = principalInterest;
  let solvedField: "loanAmount" | "annualRate" | "years" | "principalInterest" | "none" = "none";
  let solvedBy = "all inputs";

  if (resolvedLoanAmount === undefined) {
    if (resolvedAnnualRate === undefined || resolvedYears === undefined || resolvedPrincipalInterest === undefined) {
      return undefined;
    }

    const solved = solveMortgageAmount(resolvedPrincipalInterest, resolvedAnnualRate, resolvedYears);

    if (solved === undefined || solved <= 0) {
      return {
        error: "These inputs do not produce a valid loan amount."
      };
    }

    resolvedLoanAmount = solved;
    solvedField = "loanAmount";
    solvedBy = "rate, term, and principal plus interest payment";
  } else if (resolvedAnnualRate === undefined) {
    if (resolvedYears === undefined || resolvedPrincipalInterest === undefined) {
      return undefined;
    }

    const solved = solveMortgageAnnualRate(resolvedLoanAmount, resolvedPrincipalInterest, resolvedYears);

    if (solved === undefined || solved < 0) {
      return {
        error: "That principal-and-interest payment is too low for this loan amount and term, so there is no valid positive rate to solve for."
      };
    }

    resolvedAnnualRate = solved;
    solvedField = "annualRate";
    solvedBy = "amount, term, and principal plus interest payment";
  } else if (resolvedYears === undefined) {
    if (resolvedPrincipalInterest === undefined) {
      return undefined;
    }

    const solved = solveMortgageYears(resolvedLoanAmount, resolvedAnnualRate, resolvedPrincipalInterest);

    if (solved === undefined || !Number.isFinite(solved) || solved <= 0) {
      return {
        error: "That principal-and-interest payment is too low to fully amortize the loan at this rate."
      };
    }

    resolvedYears = solved;
    solvedField = "years";
    solvedBy = "amount, rate, and principal plus interest payment";
  } else if (resolvedPrincipalInterest === undefined) {
    resolvedPrincipalInterest = amortizedMonthlyPayment(resolvedLoanAmount, resolvedAnnualRate, Math.round(resolvedYears * 12));
    solvedField = "principalInterest";
    solvedBy = "amount, rate, and term";
  }

  if (
    resolvedLoanAmount === undefined ||
    resolvedAnnualRate === undefined ||
    resolvedYears === undefined ||
    resolvedPrincipalInterest === undefined
  ) {
    return undefined;
  }

  const expectedPayment = amortizedMonthlyPayment(resolvedLoanAmount, resolvedAnnualRate, Math.round(resolvedYears * 12));

  if (Math.abs(expectedPayment - resolvedPrincipalInterest) > 0.5) {
    return {
      error: "These core mortgage inputs conflict with each other. Clear one field or adjust the amount, rate, term, and principal-and-interest payment so they agree."
    };
  }

  return {
    loanAmount: resolvedLoanAmount,
    annualRate: resolvedAnnualRate,
    years: resolvedYears,
    principalInterest: resolvedPrincipalInterest,
    solvedField,
    solvedBy
  };
}

export function MortgageCalculator() {
  const [scheduleView, setScheduleView] = useState<"annual" | "monthly">("annual");
  const [comparisonEnabled, setComparisonEnabled] = useState(false);
  const [comparisonState, setComparisonState] = useState(initialState);
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["loanAmount", "annualRate", "targetPrincipalInterest", "years", "propertyTaxAnnual", "insuranceAnnual", "hoaMonthly", "pmiMonthly", "extraMonthlyPayment"]
  });

  const loanAmount = parseNumberInput(state.loanAmount);
  const annualRate = parseNumberInput(state.annualRate);
  const principalInterest = parseNumberInput(state.targetPrincipalInterest);
  const years = parseNumberInput(state.years);
  const propertyTaxAnnual = parseNumberInput(state.propertyTaxAnnual) ?? 0;
  const insuranceAnnual = parseNumberInput(state.insuranceAnnual) ?? 0;
  const hoaMonthly = parseNumberInput(state.hoaMonthly) ?? 0;
  const pmiMonthly = parseNumberInput(state.pmiMonthly) ?? 0;
  const extraMonthlyPayment = parseNumberInput(state.extraMonthlyPayment) ?? 0;

  const resolved = useMemo(
    () =>
      resolveMortgageCore({
        loanAmount,
        annualRate,
        years,
        principalInterest
      }),
    [annualRate, loanAmount, principalInterest, years]
  );

  const result = useMemo(() => {
    if (!resolved || "error" in resolved) {
      return undefined;
    }

    return calculateMortgage({
      loanAmount: resolved.loanAmount,
      annualRate: resolved.annualRate,
      years: resolved.years,
      propertyTaxAnnual,
      insuranceAnnual,
      hoaMonthly,
      pmiMonthly,
      extraMonthlyPayment
    });
  }, [extraMonthlyPayment, hoaMonthly, insuranceAnnual, pmiMonthly, propertyTaxAnnual, resolved]);

  const comparisonLoanAmount = parseNumberInput(comparisonState.loanAmount);
  const comparisonAnnualRate = parseNumberInput(comparisonState.annualRate);
  const comparisonPrincipalInterest = parseNumberInput(comparisonState.targetPrincipalInterest);
  const comparisonYears = parseNumberInput(comparisonState.years);
  const comparisonPropertyTaxAnnual = parseNumberInput(comparisonState.propertyTaxAnnual) ?? 0;
  const comparisonInsuranceAnnual = parseNumberInput(comparisonState.insuranceAnnual) ?? 0;
  const comparisonHoaMonthly = parseNumberInput(comparisonState.hoaMonthly) ?? 0;
  const comparisonPmiMonthly = parseNumberInput(comparisonState.pmiMonthly) ?? 0;
  const comparisonExtraMonthlyPayment = parseNumberInput(comparisonState.extraMonthlyPayment) ?? 0;

  const comparisonResolved = useMemo(
    () =>
      comparisonEnabled
        ? resolveMortgageCore({
            loanAmount: comparisonLoanAmount,
            annualRate: comparisonAnnualRate,
            years: comparisonYears,
            principalInterest: comparisonPrincipalInterest
          })
        : undefined,
    [comparisonAnnualRate, comparisonEnabled, comparisonLoanAmount, comparisonPrincipalInterest, comparisonYears]
  );

  const comparisonResult = useMemo(() => {
    if (!comparisonEnabled || !comparisonResolved || "error" in comparisonResolved) {
      return undefined;
    }

    return calculateMortgage({
      loanAmount: comparisonResolved.loanAmount,
      annualRate: comparisonResolved.annualRate,
      years: comparisonResolved.years,
      propertyTaxAnnual: comparisonPropertyTaxAnnual,
      insuranceAnnual: comparisonInsuranceAnnual,
      hoaMonthly: comparisonHoaMonthly,
      pmiMonthly: comparisonPmiMonthly,
      extraMonthlyPayment: comparisonExtraMonthlyPayment
    });
  }, [
    comparisonEnabled,
    comparisonExtraMonthlyPayment,
    comparisonHoaMonthly,
    comparisonInsuranceAnnual,
    comparisonPmiMonthly,
    comparisonPropertyTaxAnnual,
    comparisonResolved
  ]);

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="surface p-6 md:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField label="Loan amount" prefix="$" value={state.loanAmount} onChange={(event) => setState((current) => ({ ...current, loanAmount: event.target.value }))} />
              <InputField label="Interest rate" hint="Annual %" value={state.annualRate} onChange={(event) => setState((current) => ({ ...current, annualRate: event.target.value }))} />
              <InputField label="Loan term" hint="Years" value={state.years} onChange={(event) => setState((current) => ({ ...current, years: event.target.value }))} />
              <InputField
                label="Principal + interest"
                hint="Monthly core payment"
                prefix="$"
                value={state.targetPrincipalInterest}
                onChange={(event) => setState((current) => ({ ...current, targetPrincipalInterest: event.target.value }))}
              />
              <InputField label="Property tax" hint="Annual" prefix="$" value={state.propertyTaxAnnual} onChange={(event) => setState((current) => ({ ...current, propertyTaxAnnual: event.target.value }))} />
              <InputField label="Home insurance" hint="Annual" prefix="$" value={state.insuranceAnnual} onChange={(event) => setState((current) => ({ ...current, insuranceAnnual: event.target.value }))} />
              <InputField label="HOA dues" hint="Monthly" prefix="$" value={state.hoaMonthly} onChange={(event) => setState((current) => ({ ...current, hoaMonthly: event.target.value }))} />
              <InputField label="PMI" hint="Monthly" prefix="$" value={state.pmiMonthly} onChange={(event) => setState((current) => ({ ...current, pmiMonthly: event.target.value }))} />
              <InputField label="Extra payment" hint="Monthly" prefix="$" value={state.extraMonthlyPayment} onChange={(event) => setState((current) => ({ ...current, extraMonthlyPayment: event.target.value }))} />
            </div>
            <p className="mt-4 text-sm leading-7 text-muted">
              Enter any three core fields above and leave the fourth blank. The calculator solves the missing loan amount, rate, term, or principal-and-interest payment, then layers taxes, insurance, HOA, PMI, and extra payments on top.
            </p>
            <div className="mt-6">
              <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
            </div>
          </div>
          <ExamplePresetList
            title="Try an example"
            body="Use a preset scenario to solve for a monthly payment, implied rate, or payoff term without re-entering the full mortgage setup."
            items={[
              {
                label: "Solve monthly payment",
                description: "A standard $400,000 mortgage at 6.5% over 30 years with housing costs added separately.",
                onApply: () =>
                  setState({
                    loanAmount: "400000",
                    annualRate: "6.5",
                    targetPrincipalInterest: "",
                    years: "30",
                    propertyTaxAnnual: "4800",
                    insuranceAnnual: "1800",
                    hoaMonthly: "0",
                    pmiMonthly: "0",
                    extraMonthlyPayment: "0"
                  })
              },
              {
                label: "Solve rate from payment",
                description: "Back into the implied rate from a $2,528.27 principal-and-interest payment on a $400,000, 30-year loan.",
                onApply: () =>
                  setState({
                    loanAmount: "400000",
                    annualRate: "",
                    targetPrincipalInterest: "2528.27",
                    years: "30",
                    propertyTaxAnnual: "4800",
                    insuranceAnnual: "1800",
                    hoaMonthly: "0",
                    pmiMonthly: "0",
                    extraMonthlyPayment: "0"
                  })
              },
              {
                label: "Solve term from payment",
                description: "Estimate how long a $2,800 principal-and-interest payment would take to amortize a $400,000 loan at 6.5%.",
                onApply: () =>
                  setState({
                    loanAmount: "400000",
                    annualRate: "6.5",
                    targetPrincipalInterest: "2800",
                    years: "",
                    propertyTaxAnnual: "4800",
                    insuranceAnnual: "1800",
                    hoaMonthly: "0",
                    pmiMonthly: "0",
                    extraMonthlyPayment: "0"
                  })
              }
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
            title="Compare two mortgage scenarios"
            body="Compare monthly payment, total interest, and payoff speed across two mortgage setups without losing the shareable primary scenario."
          />
          {comparisonEnabled ? (
            <div className="surface p-6 md:p-8">
              <div className="mb-6">
                <p className="section-label">Comparison scenario</p>
                <h3 className="mt-3 text-2xl font-semibold">Set the second mortgage option</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField label="Loan amount" prefix="$" value={comparisonState.loanAmount} onChange={(event) => setComparisonState((current) => ({ ...current, loanAmount: event.target.value }))} />
                <InputField label="Interest rate" hint="Annual %" value={comparisonState.annualRate} onChange={(event) => setComparisonState((current) => ({ ...current, annualRate: event.target.value }))} />
                <InputField label="Loan term" hint="Years" value={comparisonState.years} onChange={(event) => setComparisonState((current) => ({ ...current, years: event.target.value }))} />
                <InputField label="Principal + interest" hint="Monthly core payment" prefix="$" value={comparisonState.targetPrincipalInterest} onChange={(event) => setComparisonState((current) => ({ ...current, targetPrincipalInterest: event.target.value }))} />
                <InputField label="Property tax" hint="Annual" prefix="$" value={comparisonState.propertyTaxAnnual} onChange={(event) => setComparisonState((current) => ({ ...current, propertyTaxAnnual: event.target.value }))} />
                <InputField label="Home insurance" hint="Annual" prefix="$" value={comparisonState.insuranceAnnual} onChange={(event) => setComparisonState((current) => ({ ...current, insuranceAnnual: event.target.value }))} />
                <InputField label="HOA dues" hint="Monthly" prefix="$" value={comparisonState.hoaMonthly} onChange={(event) => setComparisonState((current) => ({ ...current, hoaMonthly: event.target.value }))} />
                <InputField label="PMI" hint="Monthly" prefix="$" value={comparisonState.pmiMonthly} onChange={(event) => setComparisonState((current) => ({ ...current, pmiMonthly: event.target.value }))} />
                <InputField label="Extra payment" hint="Monthly" prefix="$" value={comparisonState.extraMonthlyPayment} onChange={(event) => setComparisonState((current) => ({ ...current, extraMonthlyPayment: event.target.value }))} />
              </div>
            </div>
          ) : null}
        </div>
        <div className="space-y-4">
          {!resolved ? (
            <EmptyCalculatorState
              title="Enter any 3 core mortgage inputs"
              body="Use any three of these four core fields: loan amount, interest rate, loan term, and principal-plus-interest payment. Optional housing costs are added after the core mortgage is solved."
            />
          ) : "error" in resolved ? (
            <EmptyCalculatorState title="Inputs conflict" body={resolved.error ?? "The entered values conflict with each other."} />
          ) : !result ? (
            <EmptyCalculatorState
              title="Enter your mortgage details"
              body="Add enough core mortgage information to solve the loan, then use the optional housing costs to estimate the all-in monthly payment."
            />
          ) : (
            <>
              <div className="surface space-y-4 p-6 md:p-8">
                <div>
                  <p className="section-label">Mortgage payment</p>
                  <h3 className="mt-4 text-2xl font-semibold">{formatCurrency(result.totalMonthlyPayment)} / month</h3>
                  <p className="mt-2 text-sm leading-7">
                    Solved from {resolved.solvedBy}, principal and interest come to {formatCurrency(result.monthlyPrincipalInterest)} per month before taxes, insurance, HOA, PMI, and any extra payment are added.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <ResultCard label="Total monthly payment" value={formatCurrency(result.totalMonthlyPayment)} tone="success" />
                  <ResultCard label={resolved.solvedField === "loanAmount" ? "Solved loan amount" : "Loan amount"} value={formatCurrency(resolved.loanAmount)} />
                  <ResultCard label={resolved.solvedField === "annualRate" ? "Solved interest rate" : "Interest rate"} value={`${formatNumber(resolved.annualRate, 3)}%`} />
                  <ResultCard label={resolved.solvedField === "years" ? "Solved loan term" : "Loan term"} value={formatLoanTerm(resolved.years)} />
                  <ResultCard label={resolved.solvedField === "principalInterest" ? "Solved principal + interest" : "Principal + interest"} value={formatCurrency(result.monthlyPrincipalInterest)} />
                  <ResultCard label="Total interest" value={formatCurrency(result.totalInterest)} />
                  <ResultCard label="Total paid over loan" value={formatCurrency(result.totalPaid)} />
                  <ResultCard label="Payoff time" value={`${formatNumber(result.payoffMonths / 12, 1)} years`} />
                  <ResultCard label="Interest saved with extra" value={formatCurrency(result.interestSavedWithExtra)} />
                </div>
              </div>
              <InsightPanel
                title="Payment insight"
                body={
                  resolved.solvedField === "annualRate"
                    ? `Given this amount, term, and principal-and-interest payment, the implied mortgage rate is about ${formatNumber(resolved.annualRate, 3)}% before taxes and insurance are layered on top.`
                    : resolved.solvedField === "years"
                      ? `At ${formatNumber(resolved.annualRate, 3)}%, a principal-and-interest payment of ${formatCurrency(result.monthlyPrincipalInterest)} would pay this mortgage off in about ${formatLoanTerm(resolved.years)} before optional housing costs are added.`
                      : resolved.solvedField === "loanAmount"
                        ? `At ${formatNumber(resolved.annualRate, 3)}% over ${formatLoanTerm(resolved.years)}, a principal-and-interest payment of ${formatCurrency(result.monthlyPrincipalInterest)} supports a mortgage of about ${formatCurrency(resolved.loanAmount)}.`
                        : `On this ${formatLoanTerm(resolved.years)} mortgage, the interest cost alone adds up to ${formatCurrency(result.totalInterest)}. Adding extra monthly principal can shorten payoff and save about ${formatCurrency(result.interestSavedWithExtra)} in interest.`
                }
              />
              {comparisonEnabled ? (
                !comparisonResolved ? (
                  <EmptyCalculatorState
                    title="Set the comparison mortgage"
                    body="Use any three of the four core mortgage fields in the comparison scenario to see the side-by-side deltas."
                  />
                ) : "error" in comparisonResolved || !comparisonResult ? (
                  <EmptyCalculatorState
                    title="Comparison inputs conflict"
                    body={"error" in comparisonResolved ? comparisonResolved.error ?? "The comparison values conflict with each other." : "Add enough comparison inputs to calculate the second scenario."}
                  />
                ) : (
                  <div className="surface space-y-4 p-6 md:p-8">
                    <div>
                      <p className="section-label">Comparison summary</p>
                      <h3 className="mt-4 text-2xl font-semibold">How the second mortgage changes the outcome</h3>
                      <p className="mt-2 text-sm leading-7">
                        Compared with the primary scenario, the second option changes the total monthly payment by {formatCurrency(comparisonResult.totalMonthlyPayment - result.totalMonthlyPayment)}, total interest by {formatCurrency(comparisonResult.totalInterest - result.totalInterest)}, and payoff time by {formatNumber((comparisonResult.payoffMonths - result.payoffMonths) / 12, 1)} years.
                      </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <ResultCard label="Scenario B monthly payment" value={formatCurrency(comparisonResult.totalMonthlyPayment)} />
                      <ResultCard label="Monthly payment delta" value={formatCurrency(comparisonResult.totalMonthlyPayment - result.totalMonthlyPayment)} tone={comparisonResult.totalMonthlyPayment <= result.totalMonthlyPayment ? "success" : "default"} />
                      <ResultCard label="Scenario B total interest" value={formatCurrency(comparisonResult.totalInterest)} />
                      <ResultCard label="Interest delta" value={formatCurrency(comparisonResult.totalInterest - result.totalInterest)} tone={comparisonResult.totalInterest <= result.totalInterest ? "success" : "default"} />
                      <ResultCard label="Scenario B payoff time" value={formatLoanTerm(comparisonResult.payoffMonths / 12)} />
                      <ResultCard label="Payoff delta" value={`${formatNumber((comparisonResult.payoffMonths - result.payoffMonths) / 12, 1)} years`} tone={comparisonResult.payoffMonths <= result.payoffMonths ? "success" : "default"} />
                    </div>
                  <DecisionSummaryPanel body={comparisonResult.totalMonthlyPayment <= result.totalMonthlyPayment && comparisonResult.totalInterest <= result.totalInterest ? `Scenario B is better on both monthly affordability and long-term cost, so it is the cleaner mortgage option if the assumptions match your real quote.` : comparisonResult.totalMonthlyPayment <= result.totalMonthlyPayment ? `Scenario B lowers the monthly housing bill, but it does so at the cost of higher long-term borrowing drag. It is better only if monthly affordability is the limiting factor.` : comparisonResult.totalInterest <= result.totalInterest || comparisonResult.payoffMonths <= result.payoffMonths ? `Scenario B is more efficient over the life of the mortgage and pays off faster, but it asks for more monthly cash flow. It is the stronger choice when long-term cost matters more than short-term payment comfort.` : `The primary mortgage remains the more balanced setup because Scenario B does not improve the cash-flow-versus-cost tradeoff enough to justify switching.`} />
                  </div>
                )
              ) : null}
            </>
          )}
        </div>
      </div>
      {result ? (
        <>
          <LineChart
            labels={result.points.map((point) => point.year)}
            series={[
              { label: "Remaining balance", color: "#0891b2", values: result.points.map((point) => point.remainingBalance) },
              { label: "Cumulative interest paid", color: "#f59e0b", values: result.points.map((point) => point.cumulativeInterest) }
            ]}
          />
          <div className="surface space-y-5 p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="section-label">Amortization schedule</p>
                <h3 className="mt-3 text-2xl font-semibold">See how principal and interest change over time</h3>
              </div>
              <PillTabs
                options={[
                  { label: "Annual schedule", value: "annual" },
                  { label: "Monthly schedule", value: "monthly" }
                ]}
                value={scheduleView}
                onChange={setScheduleView}
              />
            </div>
            <div className="overflow-x-auto rounded-3xl border border-border">
              <table className="min-w-full divide-y divide-border text-sm">
                <thead className="bg-slate-50/80 dark:bg-slate-900/40">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">{scheduleView === "annual" ? "Year" : "Payment"}</th>
                    <th className="px-4 py-3 text-left font-semibold">Payment</th>
                    <th className="px-4 py-3 text-left font-semibold">Principal</th>
                    <th className="px-4 py-3 text-left font-semibold">Interest</th>
                    <th className="px-4 py-3 text-left font-semibold">Extra</th>
                    <th className="px-4 py-3 text-left font-semibold">Ending balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {scheduleView === "annual"
                    ? result.yearlySchedule.map((row) => (
                        <tr key={`y-${row.year}`}>
                          <td className="px-4 py-3">{row.year}</td>
                          <td className="px-4 py-3">{formatCurrency(row.payment)}</td>
                          <td className="px-4 py-3">{formatCurrency(row.principal)}</td>
                          <td className="px-4 py-3">{formatCurrency(row.interest)}</td>
                          <td className="px-4 py-3">{formatCurrency(row.extraPayment)}</td>
                          <td className="px-4 py-3">{formatCurrency(row.endingBalance)}</td>
                        </tr>
                      ))
                    : result.monthlySchedule.map((row) => (
                        <tr key={`m-${row.paymentNumber}`}>
                          <td className="px-4 py-3">{row.paymentNumber}</td>
                          <td className="px-4 py-3">{formatCurrency(row.payment)}</td>
                          <td className="px-4 py-3">{formatCurrency(row.principal)}</td>
                          <td className="px-4 py-3">{formatCurrency(row.interest)}</td>
                          <td className="px-4 py-3">{formatCurrency(row.extraPayment)}</td>
                          <td className="px-4 py-3">{formatCurrency(row.endingBalance)}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}




