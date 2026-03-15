export interface MarginInputs {
  cost?: number;
  price?: number;
  profit?: number;
  margin?: number;
  markup?: number;
}

export interface MarginResult {
  cost: number;
  price: number;
  profit: number;
  margin: number;
  markup: number;
  solvedBy: string;
  error?: string;
}

const tolerance = 0.02;

function nearlyEqual(a: number | undefined, b: number, allowedDifference = tolerance) {
  return a === undefined || Math.abs(a - b) <= allowedDifference;
}

function complete(cost: number, price: number, solvedBy: string): MarginResult | undefined {
  if (!Number.isFinite(cost) || !Number.isFinite(price) || cost < 0 || price <= 0) {
    return undefined;
  }

  const profit = price - cost;
  const margin = (profit / price) * 100;
  const markup = cost === 0 ? 0 : (profit / cost) * 100;

  return {
    cost,
    price,
    profit,
    margin,
    markup,
    solvedBy
  };
}

function matchesProvided(result: MarginResult, inputs: MarginInputs) {
  return (
    nearlyEqual(inputs.cost, result.cost) &&
    nearlyEqual(inputs.price, result.price) &&
    nearlyEqual(inputs.profit, result.profit) &&
    nearlyEqual(inputs.margin, result.margin, 0.05) &&
    nearlyEqual(inputs.markup, result.markup, 0.05)
  );
}

export function solveMargin(inputs: MarginInputs) {
  const { cost, price, profit, margin, markup } = inputs;

  const candidates: Array<MarginResult | undefined> = [
    cost !== undefined && price !== undefined ? complete(cost, price, "cost and selling price") : undefined,
    cost !== undefined && profit !== undefined ? complete(cost, cost + profit, "cost and profit") : undefined,
    price !== undefined && profit !== undefined ? complete(price - profit, price, "selling price and profit") : undefined,
    cost !== undefined && margin !== undefined && margin < 100 ? complete(cost, cost / (1 - margin / 100), "cost and margin") : undefined,
    cost !== undefined && markup !== undefined ? complete(cost, cost * (1 + markup / 100), "cost and markup") : undefined,
    price !== undefined && margin !== undefined && margin >= 0 && margin < 100 ? complete(price * (1 - margin / 100), price, "selling price and margin") : undefined,
    price !== undefined && markup !== undefined && markup > -100 ? complete(price / (1 + markup / 100), price, "selling price and markup") : undefined,
    profit !== undefined && margin !== undefined && margin > 0 && margin < 100
      ? (() => {
          const derivedPrice = profit / (margin / 100);
          return complete(derivedPrice - profit, derivedPrice, "profit and margin");
        })()
      : undefined,
    profit !== undefined && markup !== undefined && markup !== 0
      ? (() => {
          const derivedCost = profit / (markup / 100);
          return complete(derivedCost, derivedCost + profit, "profit and markup");
        })()
      : undefined
  ].filter(Boolean);

  if (candidates.length === 0) {
    return undefined;
  }

  const consistent = candidates.find((candidate) => candidate && matchesProvided(candidate, inputs));
  if (consistent) {
    return consistent;
  }

  return {
    cost: 0,
    price: 0,
    profit: 0,
    margin: 0,
    markup: 0,
    solvedBy: "conflicting inputs",
    error: "These inputs conflict with each other. Clear one of the fields or enter any two compatible values."
  } satisfies MarginResult;
}
