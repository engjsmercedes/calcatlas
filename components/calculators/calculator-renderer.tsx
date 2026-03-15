"use client";

import { useEffect } from "react";

import type { CalculatorSlug } from "@/data/calculators";
import { useRecentCalculators } from "@/lib/hooks/use-recent-calculators";

import { BmiCalculator } from "./bmi-calculator";
import { BodyFatCalculator } from "./body-fat-calculator";
import { CalorieNeedsCalculator } from "./calorie-needs-calculator";
import { CompoundInterestCalculator } from "./compound-interest-calculator";
import { IdealWeightCalculator } from "./ideal-weight-calculator";
import { MacroCalculator } from "./macro-calculator";
import { MarginCalculator } from "./margin-calculator";
import { MortgageCalculator } from "./mortgage-calculator";
import { OneRepMaxCalculator } from "./one-rep-max-calculator";
import { PercentageCalculator } from "./percentage-calculator";
import { ProteinIntakeCalculator } from "./protein-intake-calculator";
import { RoiCalculator } from "./roi-calculator";
import { RunningPaceCalculator } from "./running-pace-calculator";
import { SalaryToHourlyCalculator } from "./salary-to-hourly-calculator";
import { SleepCycleCalculator } from "./sleep-cycle-calculator";
import { WaterIntakeCalculator } from "./water-intake-calculator";

export function CalculatorRenderer({ slug }: { slug: CalculatorSlug }) {
  useRecentCalculators(slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  switch (slug) {
    case "percentage-calculator":
      return <PercentageCalculator />;
    case "margin-calculator":
      return <MarginCalculator />;
    case "mortgage-calculator":
      return <MortgageCalculator />;
    case "roi-calculator":
      return <RoiCalculator />;
    case "compound-interest-calculator":
      return <CompoundInterestCalculator />;
    case "salary-to-hourly-calculator":
      return <SalaryToHourlyCalculator />;
    case "bmi-calculator":
      return <BmiCalculator />;
    case "calorie-needs-calculator":
      return <CalorieNeedsCalculator />;
    case "body-fat-calculator":
      return <BodyFatCalculator />;
    case "water-intake-calculator":
      return <WaterIntakeCalculator />;
    case "ideal-weight-calculator":
      return <IdealWeightCalculator />;
    case "macro-calculator":
      return <MacroCalculator />;
    case "protein-intake-calculator":
      return <ProteinIntakeCalculator />;
    case "sleep-cycle-calculator":
      return <SleepCycleCalculator />;
    case "running-pace-calculator":
      return <RunningPaceCalculator />;
    case "one-rep-max-calculator":
      return <OneRepMaxCalculator />;
    default:
      return null;
  }
}
