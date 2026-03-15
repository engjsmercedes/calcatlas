export type UnitSystem = "imperial" | "metric";
export type Sex = "male" | "female";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very-active";
export type WeightGoal = "lose" | "maintain" | "gain";
export type MacroStyle = "balanced" | "higher-protein" | "lower-carb";
export type ProteinGoal = "general" | "fat-loss" | "muscle-gain";
export type DueDateMode = "last-period" | "conception";

const POUNDS_PER_KILOGRAM = 2.2046226218;
const INCHES_PER_CENTIMETER = 0.3937007874;
const MILES_PER_KILOMETER = 0.621371;

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  "very-active": 1.9
};

const proteinFactors: Record<ActivityLevel, { general: number; fatLoss: number; muscleGain: number }> = {
  sedentary: { general: 0.7, fatLoss: 0.8, muscleGain: 0.9 },
  light: { general: 0.75, fatLoss: 0.9, muscleGain: 0.95 },
  moderate: { general: 0.8, fatLoss: 1, muscleGain: 1.05 },
  active: { general: 0.9, fatLoss: 1.05, muscleGain: 1.1 },
  "very-active": { general: 0.95, fatLoss: 1.1, muscleGain: 1.15 }
};

export function poundsToKilograms(value: number) {
  return value / POUNDS_PER_KILOGRAM;
}

export function kilogramsToPounds(value: number) {
  return value * POUNDS_PER_KILOGRAM;
}

export function inchesToCentimeters(value: number) {
  return value / INCHES_PER_CENTIMETER;
}

export function centimetersToInches(value: number) {
  return value * INCHES_PER_CENTIMETER;
}

export function feetAndInchesToTotalInches(feet: number, inches: number) {
  return feet * 12 + inches;
}

export function calculateBmi(inputs: {
  unitSystem: UnitSystem;
  heightCm?: number;
  weightKg?: number;
  heightFeet?: number;
  heightInches?: number;
  weightLb?: number;
}) {
  const heightMeters =
    inputs.unitSystem === "metric"
      ? (inputs.heightCm || 0) / 100
      : (feetAndInchesToTotalInches(inputs.heightFeet || 0, inputs.heightInches || 0) * 2.54) / 100;
  const weightKg = inputs.unitSystem === "metric" ? inputs.weightKg || 0 : poundsToKilograms(inputs.weightLb || 0);

  if (heightMeters <= 0 || weightKg <= 0) {
    return undefined;
  }

  const bmi = weightKg / (heightMeters * heightMeters);
  const category =
    bmi < 18.5 ? "Underweight" : bmi < 25 ? "Healthy weight" : bmi < 30 ? "Overweight" : "Obesity";

  return {
    bmi,
    category,
    healthyWeightRangeKg: {
      min: 18.5 * heightMeters * heightMeters,
      max: 24.9 * heightMeters * heightMeters
    },
    healthyWeightRangeLb: {
      min: kilogramsToPounds(18.5 * heightMeters * heightMeters),
      max: kilogramsToPounds(24.9 * heightMeters * heightMeters)
    }
  };
}

export function calculateCalorieNeeds(inputs: {
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: WeightGoal;
}) {
  const { age, sex, heightCm, weightKg, activityLevel } = inputs;
  if (age <= 0 || heightCm <= 0 || weightKg <= 0) {
    return undefined;
  }

  const bmr = sex === "male" ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5 : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  const maintenance = bmr * activityMultipliers[activityLevel];
  const lose = maintenance - 450;
  const gain = maintenance + 300;

  return {
    bmr,
    maintenance,
    lose,
    gain
  };
}

export function calculateBodyFat(inputs: {
  unitSystem: UnitSystem;
  sex: Sex;
  heightCm?: number;
  neckCm?: number;
  waistCm?: number;
  hipsCm?: number;
  heightInches?: number;
  neckInches?: number;
  waistInches?: number;
  hipsInches?: number;
}) {
  const height = inputs.unitSystem === "metric" ? centimetersToInches(inputs.heightCm || 0) : inputs.heightInches || 0;
  const neck = inputs.unitSystem === "metric" ? centimetersToInches(inputs.neckCm || 0) : inputs.neckInches || 0;
  const waist = inputs.unitSystem === "metric" ? centimetersToInches(inputs.waistCm || 0) : inputs.waistInches || 0;
  const hips = inputs.unitSystem === "metric" ? centimetersToInches(inputs.hipsCm || 0) : inputs.hipsInches || 0;

  if (height <= 0 || neck <= 0 || waist <= 0) {
    return undefined;
  }

  const bodyFat =
    inputs.sex === "male"
      ? 86.01 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76
      : 163.205 * Math.log10(waist + hips - neck) - 97.684 * Math.log10(height) - 78.387;

  if (!Number.isFinite(bodyFat)) {
    return undefined;
  }

  const category =
    inputs.sex === "male"
      ? bodyFat < 6
        ? "Essential fat"
        : bodyFat < 14
          ? "Athletic"
          : bodyFat < 18
            ? "Fitness"
            : bodyFat < 25
              ? "Average"
              : "Above average"
      : bodyFat < 14
        ? "Essential fat"
        : bodyFat < 21
          ? "Athletic"
          : bodyFat < 25
            ? "Fitness"
            : bodyFat < 32
              ? "Average"
              : "Above average";

  return {
    bodyFat,
    category
  };
}

export function calculateWaterIntake(inputs: {
  unitSystem: UnitSystem;
  weightKg?: number;
  weightLb?: number;
  activityLevel: ActivityLevel;
  climateAdjustment: "cool" | "moderate" | "hot";
}) {
  const weightLb = inputs.unitSystem === "metric" ? kilogramsToPounds(inputs.weightKg || 0) : inputs.weightLb || 0;
  if (weightLb <= 0) {
    return undefined;
  }

  let ounces = weightLb * 0.5;
  const activityBonus = { sedentary: 0, light: 12, moderate: 20, active: 30, "very-active": 40 }[inputs.activityLevel];
  const climateBonus = { cool: 0, moderate: 10, hot: 24 }[inputs.climateAdjustment];
  ounces += activityBonus + climateBonus;

  return {
    ounces,
    liters: ounces * 0.0295735,
    cups: ounces / 8
  };
}

export function calculateIdealWeight(inputs: {
  sex: Sex;
  unitSystem: UnitSystem;
  heightCm?: number;
  heightFeet?: number;
  heightInches?: number;
}) {
  const heightInches =
    inputs.unitSystem === "metric"
      ? centimetersToInches(inputs.heightCm || 0)
      : feetAndInchesToTotalInches(inputs.heightFeet || 0, inputs.heightInches || 0);
  if (heightInches <= 0) {
    return undefined;
  }

  const base = inputs.sex === "male" ? 50 : 45.5;
  const extra = Math.max(0, heightInches - 60) * (inputs.sex === "male" ? 2.3 : 2.3);
  const devineKg = base + extra;
  const healthyRangeMinKg = 18.5 * Math.pow((heightInches * 2.54) / 100, 2);
  const healthyRangeMaxKg = 24.9 * Math.pow((heightInches * 2.54) / 100, 2);

  return {
    devineKg,
    devineLb: kilogramsToPounds(devineKg),
    healthyRangeKg: { min: healthyRangeMinKg, max: healthyRangeMaxKg },
    healthyRangeLb: { min: kilogramsToPounds(healthyRangeMinKg), max: kilogramsToPounds(healthyRangeMaxKg) }
  };
}

export function calculateMacros(inputs: {
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: "fat-loss" | "maintenance" | "muscle-gain";
  style: MacroStyle;
}) {
  const calories = calculateCalorieNeeds({
    age: inputs.age,
    sex: inputs.sex,
    heightCm: inputs.heightCm,
    weightKg: inputs.weightKg,
    activityLevel: inputs.activityLevel,
    goal: inputs.goal === "fat-loss" ? "lose" : inputs.goal === "muscle-gain" ? "gain" : "maintain"
  });

  if (!calories) {
    return undefined;
  }

  const calorieTarget = inputs.goal === "fat-loss" ? calories.lose : inputs.goal === "muscle-gain" ? calories.gain : calories.maintenance;
  const macroRatios: Record<MacroStyle, { protein: number; carbs: number; fat: number }> = {
    balanced: { protein: 0.3, carbs: 0.4, fat: 0.3 },
    "higher-protein": { protein: 0.35, carbs: 0.3, fat: 0.35 },
    "lower-carb": { protein: 0.35, carbs: 0.2, fat: 0.45 }
  };
  const ratios = macroRatios[inputs.style];

  return {
    calories: calorieTarget,
    proteinGrams: (calorieTarget * ratios.protein) / 4,
    carbsGrams: (calorieTarget * ratios.carbs) / 4,
    fatGrams: (calorieTarget * ratios.fat) / 9,
    maintenanceCalories: calories.maintenance
  };
}

export function calculateProteinIntake(inputs: {
  unitSystem: UnitSystem;
  weightKg?: number;
  weightLb?: number;
  activityLevel: ActivityLevel;
  goal: ProteinGoal;
}) {
  const weightLb = inputs.unitSystem === "metric" ? kilogramsToPounds(inputs.weightKg || 0) : inputs.weightLb || 0;
  if (weightLb <= 0) {
    return undefined;
  }

  const factors = proteinFactors[inputs.activityLevel];
  const baseFactor =
    inputs.goal === "general" ? factors.general : inputs.goal === "fat-loss" ? factors.fatLoss : factors.muscleGain;
  const min = weightLb * Math.max(0.65, baseFactor - 0.1);
  const max = weightLb * (baseFactor + 0.1);

  return {
    min,
    max,
    target: weightLb * baseFactor
  };
}

export function calculateSleepCycle(inputs: {
  mode: "bedtime" | "wake-time";
  time: string;
  cycles: number;
}) {
  if (!inputs.time || inputs.cycles <= 0) {
    return undefined;
  }

  const [hoursText, minutesText] = inputs.time.split(":");
  const hours = Number(hoursText);
  const minutes = Number(minutesText);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return undefined;
  }

  const base = new Date(2000, 0, 1, hours, minutes, 0, 0);
  const cycleMinutes = 90;
  const fallAsleepBuffer = 15;
  const recommendations: string[] = [];

  for (let offset = Math.max(1, inputs.cycles - 2); offset <= inputs.cycles + 1; offset += 1) {
    const next = new Date(base.getTime());
    const delta = (cycleMinutes * offset + fallAsleepBuffer) * 60 * 1000;
    const time = inputs.mode === "bedtime" ? new Date(next.getTime() + delta) : new Date(next.getTime() - delta);
    recommendations.push(formatClock(time));
  }

  return {
    recommendations,
    cycleLengthMinutes: cycleMinutes,
    bufferMinutes: fallAsleepBuffer
  };
}

export function calculateRunningPace(inputs: {
  mode: "time-to-pace" | "pace-to-time";
  distance: number;
  distanceUnit: "miles" | "kilometers";
  hours?: number;
  minutes?: number;
  seconds?: number;
  paceMinutes?: number;
  paceSeconds?: number;
}) {
  if (inputs.distance <= 0) {
    return undefined;
  }

  const distanceMiles = inputs.distanceUnit === "miles" ? inputs.distance : inputs.distance * MILES_PER_KILOMETER;
  const distanceKm = inputs.distanceUnit === "kilometers" ? inputs.distance : inputs.distance / MILES_PER_KILOMETER;

  if (inputs.mode === "time-to-pace") {
    const totalSeconds = (inputs.hours || 0) * 3600 + (inputs.minutes || 0) * 60 + (inputs.seconds || 0);
    if (totalSeconds <= 0) {
      return undefined;
    }

    const secondsPerMile = totalSeconds / distanceMiles;
    const secondsPerKm = totalSeconds / distanceKm;
    return {
      pacePerMile: formatDuration(secondsPerMile),
      pacePerKilometer: formatDuration(secondsPerKm),
      speedMph: distanceMiles / (totalSeconds / 3600),
      speedKph: distanceKm / (totalSeconds / 3600),
      finishTime: formatDuration(totalSeconds)
    };
  }

  const paceSeconds = (inputs.paceMinutes || 0) * 60 + (inputs.paceSeconds || 0);
  if (paceSeconds <= 0) {
    return undefined;
  }

  const totalSeconds = paceSeconds * (inputs.distanceUnit === "miles" ? distanceMiles : distanceKm);
  const secondsPerMile = inputs.distanceUnit === "miles" ? paceSeconds : totalSeconds / distanceMiles;
  const secondsPerKm = inputs.distanceUnit === "kilometers" ? paceSeconds : totalSeconds / distanceKm;

  return {
    pacePerMile: formatDuration(secondsPerMile),
    pacePerKilometer: formatDuration(secondsPerKm),
    speedMph: distanceMiles / (totalSeconds / 3600),
    speedKph: distanceKm / (totalSeconds / 3600),
    finishTime: formatDuration(totalSeconds)
  };
}

export function calculateOneRepMax(weight: number, reps: number) {
  if (weight <= 0 || reps <= 0) {
    return undefined;
  }

  const oneRepMax = weight * (1 + reps / 30);
  const repTable = Array.from({ length: 9 }, (_, index) => {
    const repCount = index + 2;
    return {
      reps: repCount,
      estimatedWeight: oneRepMax / (1 + repCount / 30)
    };
  });

  return {
    oneRepMax,
    repTable
  };
}

export function calculateTdee(inputs: {
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: WeightGoal;
}) {
  const calories = calculateCalorieNeeds(inputs);
  if (!calories) {
    return undefined;
  }

  const targetCalories = inputs.goal === "lose" ? calories.lose : inputs.goal === "gain" ? calories.gain : calories.maintenance;

  return {
    bmr: calories.bmr,
    tdee: calories.maintenance,
    targetCalories,
    activityMultiplier: activityMultipliers[inputs.activityLevel]
  };
}

export function calculatePregnancyDueDate(inputs: {
  mode: DueDateMode;
  referenceDate: string;
  cycleLength: number;
}) {
  if (!inputs.referenceDate) {
    return undefined;
  }

  const reference = new Date(`${inputs.referenceDate}T00:00:00`);
  if (Number.isNaN(reference.getTime())) {
    return undefined;
  }

  const cycleLength = Number.isFinite(inputs.cycleLength) && inputs.cycleLength > 0 ? inputs.cycleLength : 28;
  const dueDate = new Date(reference.getTime());
  const ovulationDate = new Date(reference.getTime());

  if (inputs.mode === "last-period") {
    dueDate.setDate(dueDate.getDate() + 280);
    ovulationDate.setDate(ovulationDate.getDate() + Math.max(0, cycleLength - 14));
  } else {
    dueDate.setDate(dueDate.getDate() + 266);
  }

  const fertileStart = new Date(ovulationDate.getTime());
  fertileStart.setDate(fertileStart.getDate() - 5);
  const fertileEnd = new Date(ovulationDate.getTime());
  fertileEnd.setDate(fertileEnd.getDate() + 1);

  return {
    dueDate,
    ovulationDate,
    fertileStart,
    fertileEnd,
    currentWeek: Math.max(0, Math.floor(((Date.now() - (inputs.mode === "last-period" ? reference.getTime() : reference.getTime() - 14 * 24 * 60 * 60 * 1000)) / (7 * 24 * 60 * 60 * 1000))))
  };
}

export function calculateOvulation(inputs: {
  lastPeriodDate: string;
  cycleLength: number;
}) {
  if (!inputs.lastPeriodDate) {
    return undefined;
  }

  const start = new Date(`${inputs.lastPeriodDate}T00:00:00`);
  if (Number.isNaN(start.getTime())) {
    return undefined;
  }

  const cycleLength = Number.isFinite(inputs.cycleLength) && inputs.cycleLength > 0 ? inputs.cycleLength : 28;
  const ovulationDate = new Date(start.getTime());
  ovulationDate.setDate(ovulationDate.getDate() + Math.max(0, cycleLength - 14));

  const fertileStart = new Date(ovulationDate.getTime());
  fertileStart.setDate(fertileStart.getDate() - 5);

  const fertileEnd = new Date(ovulationDate.getTime());
  fertileEnd.setDate(fertileEnd.getDate() + 1);

  const nextPeriod = new Date(start.getTime());
  nextPeriod.setDate(nextPeriod.getDate() + cycleLength);

  return {
    ovulationDate,
    fertileStart,
    fertileEnd,
    nextPeriod
  };
}

export function calculateHeartRateZones(inputs: {
  age: number;
  restingHeartRate?: number;
}) {
  if (inputs.age <= 0) {
    return undefined;
  }

  const maxHeartRate = 220 - inputs.age;
  const resting = inputs.restingHeartRate && inputs.restingHeartRate > 0 ? inputs.restingHeartRate : undefined;
  const reserve = resting ? maxHeartRate - resting : undefined;

  const zoneBands = [
    { label: "Zone 1", min: 0.5, max: 0.6, purpose: "Easy recovery work and warm-ups." },
    { label: "Zone 2", min: 0.6, max: 0.7, purpose: "Aerobic base building and longer steady efforts." },
    { label: "Zone 3", min: 0.7, max: 0.8, purpose: "Moderate tempo work and endurance development." },
    { label: "Zone 4", min: 0.8, max: 0.9, purpose: "Threshold work and harder sustained intervals." },
    { label: "Zone 5", min: 0.9, max: 1, purpose: "High-intensity intervals and short maximal efforts." }
  ];

  return {
    maxHeartRate,
    method: reserve ? "karvonen" : "percent-max",
    zones: zoneBands.map((zone) => ({
      ...zone,
      minBpm: Math.round(reserve !== undefined && resting !== undefined ? resting + reserve * zone.min : maxHeartRate * zone.min),
      maxBpm: Math.round(reserve !== undefined && resting !== undefined ? resting + reserve * zone.max : maxHeartRate * zone.max)
    }))
  };
}

export function calculateStepsToCalories(inputs: {
  unitSystem: UnitSystem;
  steps: number;
  weightKg?: number;
  weightLb?: number;
  heightCm?: number;
  heightFeet?: number;
  heightInches?: number;
}) {
  if (inputs.steps <= 0) {
    return undefined;
  }

  const weightLb = inputs.unitSystem === "metric" ? kilogramsToPounds(inputs.weightKg || 0) : inputs.weightLb || 0;
  if (weightLb <= 0) {
    return undefined;
  }

  const heightInches =
    inputs.unitSystem === "metric"
      ? centimetersToInches(inputs.heightCm || 0)
      : feetAndInchesToTotalInches(inputs.heightFeet || 0, inputs.heightInches || 0);

  const strideInches = heightInches > 0 ? heightInches * 0.413 : 30;
  const distanceMiles = (inputs.steps * strideInches) / 63360;
  const calories = 0.53 * weightLb * distanceMiles;

  return {
    distanceMiles,
    distanceKilometers: distanceMiles / MILES_PER_KILOMETER,
    calories,
    strideInches
  };
}

function formatClock(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });
}

function formatDuration(totalSeconds: number) {
  const rounded = Math.round(totalSeconds);
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const seconds = rounded % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
