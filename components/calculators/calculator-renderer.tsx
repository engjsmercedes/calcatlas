"use client";

import { useEffect } from "react";

import type { CalculatorSlug } from "@/data/calculators";
import { useRecentCalculators } from "@/lib/hooks/use-recent-calculators";

import { AgeCalculator } from "./age-calculator";
import { AutoLoanCalculator } from "./auto-loan-calculator";
import { BmiCalculator } from "./bmi-calculator";
import { BmrCalculator } from "./bmr-calculator";
import { BodyFatCalculator } from "./body-fat-calculator";
import { TakeHomePaycheckCalculator } from "./take-home-paycheck-calculator";
import { SalesTaxCalculator } from "./sales-tax-calculator";
import { OvertimeCalculator } from "./overtime-calculator";
import { HourlyPaycheckCalculator } from "./hourly-paycheck-calculator";
import { BudgetCalculator } from "./budget-calculator";
import { BreakEvenCalculator } from "./break-even-calculator";
import { CalorieNeedsCalculator } from "./calorie-needs-calculator";
import { CommissionCalculator } from "./commission-calculator";
import { CompoundInterestCalculator } from "./compound-interest-calculator";
import { CreditCardPayoffCalculator } from "./credit-card-payoff-calculator";
import { DebtPayoffCalculator } from "./debt-payoff-calculator";
import { DateDifferenceCalculator } from "./date-difference-calculator";
import { DebtToIncomeCalculator } from "./debt-to-income-calculator";
import { DiscountCalculator } from "./discount-calculator";
import { DownPaymentCalculator } from "./down-payment-calculator";
import { IdealWeightCalculator } from "./ideal-weight-calculator";
import { InflationCalculator } from "./inflation-calculator";
import { TdeeCalculator } from "./tdee-calculator";
import { StepsToCaloriesCalculator } from "./steps-to-calories-calculator";
import { PregnancyDueDateCalculator } from "./pregnancy-due-date-calculator";
import { OvulationCalculator } from "./ovulation-calculator";
import { HeartRateZoneCalculator } from "./heart-rate-zone-calculator";
import { InterestCalculator } from "./interest-calculator";
import { LoanCalculator } from "./loan-calculator";
import { MacroCalculator } from "./macro-calculator";
import { MarginCalculator } from "./margin-calculator";
import { MortgageAffordabilityCalculator } from "./mortgage-affordability-calculator";
import { MortgageCalculator } from "./mortgage-calculator";
import { NetWorthCalculator } from "./net-worth-calculator";
import { OneRepMaxCalculator } from "./one-rep-max-calculator";
import { PercentageCalculator } from "./percentage-calculator";
import { ProteinIntakeCalculator } from "./protein-intake-calculator";
import { RentVsBuyCalculator } from "./rent-vs-buy-calculator";
import { RetirementCalculator } from "./retirement-calculator";
import { RoiCalculator } from "./roi-calculator";
import { RunningPaceCalculator } from "./running-pace-calculator";
import { SalaryToHourlyCalculator } from "./salary-to-hourly-calculator";
import { SavingsGoalCalculator } from "./savings-goal-calculator";
import { SleepCycleCalculator } from "./sleep-cycle-calculator";
import { TaxCalculator } from "./tax-calculator";
import { TimeDurationCalculator } from "./time-duration-calculator";
import { TimeZoneConverter } from "./time-zone-converter";
import { UnitConverter } from "./unit-converter";
import { SpeedConverter } from "./speed-converter";
import { LengthConverter } from "./length-converter";
import { WeightConverter } from "./weight-converter";
import { TemperatureConverter } from "./temperature-converter";
import { TipCalculator } from "./tip-calculator";
import { WaterIntakeCalculator } from "./water-intake-calculator";

export function CalculatorRenderer({ slug, embedded = false }: { slug: CalculatorSlug; embedded?: boolean }) {
  useRecentCalculators(embedded ? undefined : slug);

  useEffect(() => {
    if (!embedded) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [embedded, slug]);

  switch (slug) {
    case "percentage-calculator":
      return <PercentageCalculator />;
    case "discount-calculator":
      return <DiscountCalculator />;
    case "interest-calculator":
      return <InterestCalculator />;
    case "tip-calculator":
      return <TipCalculator />;
    case "margin-calculator":
      return <MarginCalculator />;
    case "markup-calculator":
      return <MarginCalculator />;
    case "break-even-calculator":
      return <BreakEvenCalculator />;
    case "commission-calculator":
      return <CommissionCalculator />;
    case "sales-tax-calculator":
      return <SalesTaxCalculator />;
    case "budget-calculator":
      return <BudgetCalculator />;
    case "mortgage-calculator":
      return <MortgageCalculator />;
    case "mortgage-affordability-calculator":
      return <MortgageAffordabilityCalculator />;
    case "loan-calculator":
      return <LoanCalculator />;
    case "debt-payoff-calculator":
      return <DebtPayoffCalculator />;
    case "auto-loan-calculator":
      return <AutoLoanCalculator />;
    case "credit-card-payoff-calculator":
      return <CreditCardPayoffCalculator />;
    case "debt-to-income-calculator":
      return <DebtToIncomeCalculator />;
    case "down-payment-calculator":
      return <DownPaymentCalculator />;
    case "rent-vs-buy-calculator":
      return <RentVsBuyCalculator />;
    case "savings-goal-calculator":
      return <SavingsGoalCalculator />;
    case "savings-calculator":
      return <SavingsGoalCalculator />;
    case "investment-calculator":
      return <CompoundInterestCalculator />;
    case "retirement-calculator":
      return <RetirementCalculator />;
    case "inflation-calculator":
      return <InflationCalculator />;
    case "tax-calculator":
      return <TaxCalculator />;
    case "net-worth-calculator":
      return <NetWorthCalculator />;
    case "roi-calculator":
      return <RoiCalculator />;
    case "compound-interest-calculator":
      return <CompoundInterestCalculator />;
    case "salary-to-hourly-calculator":
      return <SalaryToHourlyCalculator />;
    case "salary-calculator":
      return <SalaryToHourlyCalculator />;
    case "take-home-paycheck-calculator":
      return <TakeHomePaycheckCalculator />;
    case "hourly-paycheck-calculator":
      return <HourlyPaycheckCalculator />;
    case "overtime-calculator":
      return <OvertimeCalculator />;
    case "bmi-calculator":
      return <BmiCalculator />;
    case "bmr-calculator":
      return <BmrCalculator />;
    case "calorie-needs-calculator":
      return <CalorieNeedsCalculator />;
    case "calorie-calculator":
      return <CalorieNeedsCalculator />;
    case "body-fat-calculator":
      return <BodyFatCalculator />;
    case "water-intake-calculator":
      return <WaterIntakeCalculator />;
    case "ideal-weight-calculator":
      return <IdealWeightCalculator />;
    case "macro-calculator":
      return <MacroCalculator />;
    case "tdee-calculator":
      return <TdeeCalculator />;
    case "protein-intake-calculator":
      return <ProteinIntakeCalculator />;
    case "sleep-cycle-calculator":
      return <SleepCycleCalculator />;
    case "pregnancy-due-date-calculator":
      return <PregnancyDueDateCalculator />;
    case "ovulation-calculator":
      return <OvulationCalculator />;
    case "heart-rate-zone-calculator":
      return <HeartRateZoneCalculator />;
    case "steps-to-calories-calculator":
      return <StepsToCaloriesCalculator />;
    case "age-calculator":
      return <AgeCalculator />;
    case "date-difference-calculator":
      return <DateDifferenceCalculator />;
    case "time-duration-calculator":
      return <TimeDurationCalculator />;
    case "unit-converter":
      return <UnitConverter />;
    case "speed-converter":
      return <SpeedConverter />;
    case "length-converter":
      return <LengthConverter />;
    case "weight-converter":
      return <WeightConverter />;
    case "temperature-converter":
      return <TemperatureConverter />;
    case "time-zone-converter":
      return <TimeZoneConverter />;
    case "running-pace-calculator":
      return <RunningPaceCalculator />;
    case "one-rep-max-calculator":
      return <OneRepMaxCalculator />;
    default:
      return null;
  }
}
