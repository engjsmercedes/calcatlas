"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { LineChart } from "@/components/ui/line-chart";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateRentVsBuy } from "@/lib/calculators/borrowing";
import { formatCurrency, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const initialState = {
  homePrice: "450000",
  downPayment: "90000",
  mortgageRate: "6.3",
  loanTermYears: "30",
  monthlyRent: "2600",
  yearsInHome: "7",
  annualHomeAppreciation: "3",
  annualRentIncrease: "4",
  propertyTaxRate: "1.1",
  maintenanceRate: "1",
  closingCostsRate: "3",
  sellingCostsRate: "6"
};

export function RentVsBuyCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: [
      "homePrice",
      "downPayment",
      "mortgageRate",
      "loanTermYears",
      "monthlyRent",
      "yearsInHome",
      "annualHomeAppreciation",
      "annualRentIncrease",
      "propertyTaxRate",
      "maintenanceRate",
      "closingCostsRate",
      "sellingCostsRate"
    ]
  });

  const result = useMemo(
    () =>
      calculateRentVsBuy({
        homePrice: parseNumberInput(state.homePrice) || 0,
        downPayment: parseNumberInput(state.downPayment) || 0,
        mortgageRate: parseNumberInput(state.mortgageRate) || 0,
        loanTermYears: parseNumberInput(state.loanTermYears) || 0,
        monthlyRent: parseNumberInput(state.monthlyRent) || 0,
        yearsInHome: parseNumberInput(state.yearsInHome) || 0,
        annualHomeAppreciation: parseNumberInput(state.annualHomeAppreciation) || 0,
        annualRentIncrease: parseNumberInput(state.annualRentIncrease) || 0,
        propertyTaxRate: parseNumberInput(state.propertyTaxRate) || 0,
        maintenanceRate: parseNumberInput(state.maintenanceRate) || 0,
        closingCostsRate: parseNumberInput(state.closingCostsRate) || 0,
        sellingCostsRate: parseNumberInput(state.sellingCostsRate) || 0
      }),
    [state]
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="surface p-6 md:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField label="Home price" prefix="$" value={state.homePrice} onChange={(event) => setState((current) => ({ ...current, homePrice: event.target.value }))} />
              <InputField label="Down payment" prefix="$" value={state.downPayment} onChange={(event) => setState((current) => ({ ...current, downPayment: event.target.value }))} />
              <InputField label="Mortgage rate" hint="Annual %" value={state.mortgageRate} onChange={(event) => setState((current) => ({ ...current, mortgageRate: event.target.value }))} />
              <InputField label="Loan term" hint="Years" value={state.loanTermYears} onChange={(event) => setState((current) => ({ ...current, loanTermYears: event.target.value }))} />
              <InputField label="Monthly rent" prefix="$" value={state.monthlyRent} onChange={(event) => setState((current) => ({ ...current, monthlyRent: event.target.value }))} />
              <InputField label="Years staying" value={state.yearsInHome} onChange={(event) => setState((current) => ({ ...current, yearsInHome: event.target.value }))} />
              <InputField label="Home appreciation" hint="Annual %" value={state.annualHomeAppreciation} onChange={(event) => setState((current) => ({ ...current, annualHomeAppreciation: event.target.value }))} />
              <InputField label="Rent increase" hint="Annual %" value={state.annualRentIncrease} onChange={(event) => setState((current) => ({ ...current, annualRentIncrease: event.target.value }))} />
              <InputField label="Property tax" hint="Annual % of price" value={state.propertyTaxRate} onChange={(event) => setState((current) => ({ ...current, propertyTaxRate: event.target.value }))} />
              <InputField label="Maintenance" hint="Annual % of price" value={state.maintenanceRate} onChange={(event) => setState((current) => ({ ...current, maintenanceRate: event.target.value }))} />
              <InputField label="Closing costs" hint="Percent" value={state.closingCostsRate} onChange={(event) => setState((current) => ({ ...current, closingCostsRate: event.target.value }))} />
              <InputField label="Selling costs" hint="Percent" value={state.sellingCostsRate} onChange={(event) => setState((current) => ({ ...current, sellingCostsRate: event.target.value }))} />
            </div>
            <div className="mt-6">
              <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
            </div>
          </div>
          <ExamplePresetList
            title="Try an example"
            body="Use presets to see how a longer stay versus a shorter stay changes the rent-versus-buy picture."
            items={[
              {
                label: "Longer stay",
                description: "$450,000 home, $90,000 down, $2,600 rent, and a 7-year stay. Good for seeing when ownership has time to build equity.",
                onApply: () =>
                  setState({
                    homePrice: "450000",
                    downPayment: "90000",
                    mortgageRate: "6.3",
                    loanTermYears: "30",
                    monthlyRent: "2600",
                    yearsInHome: "7",
                    annualHomeAppreciation: "3",
                    annualRentIncrease: "4",
                    propertyTaxRate: "1.1",
                    maintenanceRate: "1",
                    closingCostsRate: "3",
                    sellingCostsRate: "6"
                  })
              },
              {
                label: "Shorter stay",
                description: "Same scenario but only a 3-year stay. Useful for seeing how transaction costs make renting more competitive over shorter horizons.",
                onApply: () =>
                  setState({
                    homePrice: "450000",
                    downPayment: "90000",
                    mortgageRate: "6.3",
                    loanTermYears: "30",
                    monthlyRent: "2600",
                    yearsInHome: "3",
                    annualHomeAppreciation: "3",
                    annualRentIncrease: "4",
                    propertyTaxRate: "1.1",
                    maintenanceRate: "1",
                    closingCostsRate: "3",
                    sellingCostsRate: "6"
                  })
              }
            ]}
          />
        </div>
        <div className="space-y-4">
          {!result ? (
            <EmptyCalculatorState title="Set the housing scenario" body="Enter both the buy and rent assumptions to compare long-horizon housing cost, sale equity, and a rough break-even point." />
          ) : (
            <>
              <div className="surface space-y-4 p-6 md:p-8">
                <div>
                  <p className="section-label">Rent vs buy</p>
                  <h3 className="mt-4 text-3xl font-semibold">{result.betterOption === "tie" ? "Close call" : `${result.betterOption === "buy" ? "Buying" : "Renting"} is cheaper`}</h3>
                  <p className="mt-2 text-sm leading-7">
                    Over {state.yearsInHome} years, the estimated net cost difference is about {formatCurrency(result.difference)} after accounting for owner equity and selling costs.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <ResultCard label="Rent total cost" value={formatCurrency(result.totalRentCost)} tone={result.betterOption === "rent" ? "success" : "default"} />
                  <ResultCard label="Buy net cost" value={formatCurrency(result.buyNetCost)} tone={result.betterOption === "buy" ? "success" : "default"} />
                  <ResultCard label="Monthly ownership cost" value={formatCurrency(result.monthlyOwnershipCost)} />
                  <ResultCard label="Equity after sale" value={formatCurrency(result.estimatedEquityAfterSale)} />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ResultCard label="Home value after stay" value={formatCurrency(result.estimatedHomeValue)} />
                <ResultCard label="Break-even year" value={result.breakEvenYear ? `${result.breakEvenYear} years` : "Beyond current horizon"} />
              </div>
              <InsightPanel title="Useful context" body={`This comparison is most useful when the time horizon is realistic. Buying tends to look stronger as the hold period gets longer, while shorter stays often make rent more competitive because closing and selling costs absorb a larger share of the benefit.`} />
            </>
          )}
        </div>
      </div>
      {result ? (
        <LineChart
          labels={result.points.map((point) => point.year)}
          series={[
            { label: "Rent cumulative cost", color: "#94a3b8", values: result.points.map((point) => point.rentCost) },
            { label: "Buy net cost", color: "#0891b2", values: result.points.map((point) => point.buyNetCost) }
          ]}
        />
      ) : null}
    </div>
  );
}
