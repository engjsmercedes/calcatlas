"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateApr } from "@/lib/calculators/retirement";
import { formatCurrency, formatNumber, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const initialState = {
  loanAmount: "25000",
  fees: "900",
  monthlyPayment: "497.97",
  years: "5"
};

export function AprCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["loanAmount", "fees", "monthlyPayment", "years"]
  });

  const loanAmount = parseNumberInput(state.loanAmount);
  const fees = parseNumberInput(state.fees);
  const monthlyPayment = parseNumberInput(state.monthlyPayment);
  const years = parseNumberInput(state.years);

  const result = useMemo(() => {
    if (loanAmount === undefined || fees === undefined || monthlyPayment === undefined || years === undefined) {
      return undefined;
    }

    return calculateApr({ loanAmount, fees, monthlyPayment, years });
  }, [fees, loanAmount, monthlyPayment, years]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4">
        <div className="surface p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Loan amount" prefix="$" value={state.loanAmount} onChange={(event) => setState((current) => ({ ...current, loanAmount: event.target.value }))} />
            <InputField label="Upfront fees" prefix="$" value={state.fees} onChange={(event) => setState((current) => ({ ...current, fees: event.target.value }))} />
            <InputField label="Monthly payment" prefix="$" value={state.monthlyPayment} onChange={(event) => setState((current) => ({ ...current, monthlyPayment: event.target.value }))} />
            <InputField label="Loan term" hint="Years" value={state.years} onChange={(event) => setState((current) => ({ ...current, years: event.target.value }))} />
          </div>
          <div className="mt-6">
            <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
          </div>
        </div>
        <ExamplePresetList
          title="Try an example"
          body="Use a preset to see how lender fees push APR above the simple headline note rate implied by the payment stream."
          items={[
            {
              label: "Typical personal loan",
              description: "$25,000 loan, $900 in fees, $497.97 payment, 5-year term.",
              onApply: () => setState(initialState)
            },
            {
              label: "Higher-fee loan",
              description: "Same payment and term with $1,800 in fees to show how APR rises when fees increase.",
              onApply: () =>
                setState({
                  loanAmount: "25000",
                  fees: "1800",
                  monthlyPayment: "497.97",
                  years: "5"
                })
            }
          ]}
        />
      </div>
      <div className="space-y-4">
        {!result ? (
          <EmptyCalculatorState title="Enter amount, fees, payment, and term" body="APR works backward from the amount financed and the payment stream, so those four inputs are enough to estimate the implied annual percentage rate." />
        ) : (
          <>
            <div className="surface space-y-4 p-6 md:p-8">
              <div>
                <p className="section-label">APR estimate</p>
                <h3 className="mt-4 text-3xl font-semibold">{formatNumber(result.apr, 3)}%</h3>
                <p className="mt-2 text-sm leading-7">
                  After subtracting {formatCurrency(result.amountFinanced < (loanAmount ?? 0) ? (loanAmount ?? 0) - result.amountFinanced : 0)} in fees from the amount financed, the payment stream implies an APR of about {formatNumber(result.apr, 3)}%.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ResultCard label="APR" value={`${formatNumber(result.apr, 3)}%`} tone="success" />
                <ResultCard label="Amount financed" value={formatCurrency(result.amountFinanced)} />
                <ResultCard label="Monthly payment" value={formatCurrency(result.monthlyPayment)} />
                <ResultCard label="Finance charge" value={formatCurrency(result.financeCharge)} />
                <ResultCard label="Total paid" value={formatCurrency(result.totalPaid)} />
              </div>
            </div>
            <InsightPanel title="APR note" body="APR is meant to capture the cost of credit more completely than a simple note rate because it reflects fees as well as the payment stream. That makes it useful when comparing loans that advertise similar rates but charge different upfront costs." />
          </>
        )}
      </div>
    </div>
  );
}
