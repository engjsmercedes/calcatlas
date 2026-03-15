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

export function solveMargin(inputs: MarginInputs) {
  const { cost, price, profit, margin, markup } = inputs;

  if (cost !== undefined && price !== undefined) {
    return complete(cost, price, "cost and selling price");
  }

  if (cost !== undefined && profit !== undefined) {
    return complete(cost, cost + profit, "cost and profit");
  }

  if (price !== undefined && profit !== undefined) {
    return complete(price - profit, price, "selling price and profit");
  }

  if (cost !== undefined && margin !== undefined && margin < 100) {
    return complete(cost, cost / (1 - margin / 100), "cost and margin");
  }

  if (cost !== undefined && markup !== undefined) {
    return complete(cost, cost * (1 + markup / 100), "cost and markup");
  }

  if (price !== undefined && margin !== undefined) {
    return complete(price * (1 - margin / 100), price, "selling price and margin");
  }

  if (price !== undefined && markup !== undefined && markup > -100) {
    return complete(price / (1 + markup / 100), price, "selling price and markup");
  }

  if (profit !== undefined && margin !== undefined && margin > 0 && margin < 100) {
    const derivedPrice = profit / (margin / 100);
    return complete(derivedPrice - profit, derivedPrice, "profit and margin");
  }

  if (profit !== undefined && markup !== undefined && markup !== 0) {
    const derivedCost = profit / (markup / 100);
    return complete(derivedCost, derivedCost + profit, "profit and markup");
  }

  return undefined;
}
