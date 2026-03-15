"use client";

import { useMemo, useState } from "react";

import { InputField } from "@/components/ui/input-field";
import { LineChart } from "@/components/ui/line-chart";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateRentVsBuy } from "@/lib/calculators/borrowing";
import { formatCurrency, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, ComparisonControls, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

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
  const [comparisonEnabled, setComparisonEnabled] = useState(false);
  const [comparisonState, setComparisonState] = useState(initialState);
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

  const homePrice = parseNumberInput(state.homePrice);
  const downPayment = parseNumberInput(state.downPayment);
  const mortgageRate = parseNumberInput(state.mortgageRate);
  const loanTermYears = parseNumberInput(state.loanTermYears);
  const monthlyRent = parseNumberInput(state.monthlyRent);
  const yearsInHome = parseNumberInput(state.yearsInHome);
  const annualHomeAppreciation = parseNumberInput(state.annualHomeAppreciation);
  const annualRentIncrease = parseNumberInput(state.annualRentIncrease);
  const propertyTaxRate = parseNumberInput(state.propertyTaxRate);
  const maintenanceRate = parseNumberInput(state.maintenanceRate);
  const closingCostsRate = parseNumberInput(state.closingCostsRate);
  const sellingCostsRate = parseNumberInput(state.sellingCostsRate);

  const result = useMemo(() => {
    if (
      homePrice === undefined ||
      downPayment === undefined ||
      mortgageRate === undefined ||
      loanTermYears === undefined ||
      monthlyRent === undefined ||
      yearsInHome === undefined ||
      annualHomeAppreciation === undefined ||
      annualRentIncrease === undefined ||
      propertyTaxRate === undefined ||
      maintenanceRate === undefined ||
      closingCostsRate === undefined ||
      sellingCostsRate === undefined
    ) {
      return undefined;
    }

    return calculateRentVsBuy({
      homePrice,
      downPayment,
      mortgageRate,
      loanTermYears,
      monthlyRent,
      yearsInHome,
      annualHomeAppreciation,
      annualRentIncrease,
      propertyTaxRate,
      maintenanceRate,
      closingCostsRate,
      sellingCostsRate
    });
  }, [annualHomeAppreciation, annualRentIncrease, closingCostsRate, downPayment, homePrice, loanTermYears, maintenanceRate, monthlyRent, mortgageRate, propertyTaxRate, sellingCostsRate, yearsInHome]);

  const comparisonResult = useMemo(() => {
    if (!comparisonEnabled) {
      return undefined;
    }

    const compareHomePrice = parseNumberInput(comparisonState.homePrice);
    const compareDownPayment = parseNumberInput(comparisonState.downPayment);
    const compareMortgageRate = parseNumberInput(comparisonState.mortgageRate);
    const compareLoanTermYears = parseNumberInput(comparisonState.loanTermYears);
    const compareMonthlyRent = parseNumberInput(comparisonState.monthlyRent);
    const compareYearsInHome = parseNumberInput(comparisonState.yearsInHome);
    const compareAnnualHomeAppreciation = parseNumberInput(comparisonState.annualHomeAppreciation);
    const compareAnnualRentIncrease = parseNumberInput(comparisonState.annualRentIncrease);
    const comparePropertyTaxRate = parseNumberInput(comparisonState.propertyTaxRate);
    const compareMaintenanceRate = parseNumberInput(comparisonState.maintenanceRate);
    const compareClosingCostsRate = parseNumberInput(comparisonState.closingCostsRate);
    const compareSellingCostsRate = parseNumberInput(comparisonState.sellingCostsRate);

    if (
      compareHomePrice === undefined ||
      compareDownPayment === undefined ||
      compareMortgageRate === undefined ||
      compareLoanTermYears === undefined ||
      compareMonthlyRent === undefined ||
      compareYearsInHome === undefined ||
      compareAnnualHomeAppreciation === undefined ||
      compareAnnualRentIncrease === undefined ||
      comparePropertyTaxRate === undefined ||
      compareMaintenanceRate === undefined ||
      compareClosingCostsRate === undefined ||
      compareSellingCostsRate === undefined
    ) {
      return undefined;
    }

    return calculateRentVsBuy({
      homePrice: compareHomePrice,
      downPayment: compareDownPayment,
      mortgageRate: compareMortgageRate,
      loanTermYears: compareLoanTermYears,
      monthlyRent: compareMonthlyRent,
      yearsInHome: compareYearsInHome,
      annualHomeAppreciation: compareAnnualHomeAppreciation,
      annualRentIncrease: compareAnnualRentIncrease,
      propertyTaxRate: comparePropertyTaxRate,
      maintenanceRate: compareMaintenanceRate,
      closingCostsRate: compareClosingCostsRate,
      sellingCostsRate: compareSellingCostsRate
    });
  }, [comparisonEnabled, comparisonState]);

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
          <ComparisonControls
            enabled={comparisonEnabled}
            onEnable={() => {
              setComparisonEnabled(true);
              setComparisonState(state);
            }}
            onDisable={() => setComparisonEnabled(false)}
            onCopyCurrent={() => setComparisonState(state)}
            title="Compare two housing assumptions"
            body="Test a second home price, rate, rent level, or hold period to see how the recommendation changes."
          />
          {comparisonEnabled ? (
            <div className="surface p-6 md:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField label="Compare home price" prefix="$" value={comparisonState.homePrice} onChange={(event) => setComparisonState((current) => ({ ...current, homePrice: event.target.value }))} />
                <InputField label="Compare down payment" prefix="$" value={comparisonState.downPayment} onChange={(event) => setComparisonState((current) => ({ ...current, downPayment: event.target.value }))} />
                <InputField label="Compare mortgage rate" hint="Annual %" value={comparisonState.mortgageRate} onChange={(event) => setComparisonState((current) => ({ ...current, mortgageRate: event.target.value }))} />
                <InputField label="Compare loan term" hint="Years" value={comparisonState.loanTermYears} onChange={(event) => setComparisonState((current) => ({ ...current, loanTermYears: event.target.value }))} />
                <InputField label="Compare monthly rent" prefix="$" value={comparisonState.monthlyRent} onChange={(event) => setComparisonState((current) => ({ ...current, monthlyRent: event.target.value }))} />
                <InputField label="Compare years staying" value={comparisonState.yearsInHome} onChange={(event) => setComparisonState((current) => ({ ...current, yearsInHome: event.target.value }))} />
                <InputField label="Compare home appreciation" hint="Annual %" value={comparisonState.annualHomeAppreciation} onChange={(event) => setComparisonState((current) => ({ ...current, annualHomeAppreciation: event.target.value }))} />
                <InputField label="Compare rent increase" hint="Annual %" value={comparisonState.annualRentIncrease} onChange={(event) => setComparisonState((current) => ({ ...current, annualRentIncrease: event.target.value }))} />
                <InputField label="Compare property tax" hint="Annual % of price" value={comparisonState.propertyTaxRate} onChange={(event) => setComparisonState((current) => ({ ...current, propertyTaxRate: event.target.value }))} />
                <InputField label="Compare maintenance" hint="Annual % of price" value={comparisonState.maintenanceRate} onChange={(event) => setComparisonState((current) => ({ ...current, maintenanceRate: event.target.value }))} />
                <InputField label="Compare closing costs" hint="Percent" value={comparisonState.closingCostsRate} onChange={(event) => setComparisonState((current) => ({ ...current, closingCostsRate: event.target.value }))} />
                <InputField label="Compare selling costs" hint="Percent" value={comparisonState.sellingCostsRate} onChange={(event) => setComparisonState((current) => ({ ...current, sellingCostsRate: event.target.value }))} />
              </div>
            </div>
          ) : null}
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
              <InsightPanel title="Useful context" body="This comparison is most useful when the time horizon is realistic. Buying tends to look stronger as the hold period gets longer, while shorter stays often make rent more competitive because closing and selling costs absorb a larger share of the benefit." />
              {comparisonEnabled && comparisonResult ? (
                <div className="surface space-y-4 p-6 md:p-8">
                  <div>
                    <p className="section-label">Comparison summary</p>
                    <h3 className="mt-4 text-2xl font-semibold">How the second housing scenario compares</h3>
                    <p className="mt-2 text-sm leading-7">
                      Scenario B changes the rent-versus-buy difference by {formatCurrency(comparisonResult.difference - result.difference)} and shifts the break-even point to {comparisonResult.breakEvenYear ? `${comparisonResult.breakEvenYear} years` : "beyond the current horizon"}.
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <ResultCard label="Scenario B buy net cost" value={formatCurrency(comparisonResult.buyNetCost)} />
                    <ResultCard label="Buy net cost delta" value={formatCurrency(comparisonResult.buyNetCost - result.buyNetCost)} tone={comparisonResult.buyNetCost <= result.buyNetCost ? "success" : "default"} />
                    <ResultCard label="Scenario B rent cost" value={formatCurrency(comparisonResult.totalRentCost)} />
                    <ResultCard label="Rent cost delta" value={formatCurrency(comparisonResult.totalRentCost - result.totalRentCost)} tone={comparisonResult.totalRentCost <= result.totalRentCost ? "success" : "default"} />
                    <ResultCard label="Scenario B recommendation" value={comparisonResult.betterOption === "tie" ? "Close call" : comparisonResult.betterOption === "buy" ? "Buying is cheaper" : "Renting is cheaper"} />
                    <ResultCard label="Recommendation shift" value={comparisonResult.betterOption === result.betterOption ? "Same direction" : "Recommendation changed"} tone={comparisonResult.betterOption === result.betterOption ? "default" : "success"} />
                  </div>
                </div>
              ) : null}
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
