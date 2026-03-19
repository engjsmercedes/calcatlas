import type { CalculatorDefinition } from "@/data/calculators";

export const chanceCalculatorSlugs = [
  "flip-a-coin",
  "dice-roller",
  "random-number-generator",
  "yes-no-picker",
  "random-choice-picker"
] as const;

export type ChanceCalculatorSlug = (typeof chanceCalculatorSlugs)[number];

export interface ChanceCalculatorUiConfig {
  slug: ChanceCalculatorSlug;
  mode: "coin" | "dice" | "number" | "yes-no" | "choice";
  animationLabel: string;
}

export const chanceCalculatorUiConfigs: Record<ChanceCalculatorSlug, ChanceCalculatorUiConfig> = {
  "flip-a-coin": {
    slug: "flip-a-coin",
    mode: "coin",
    animationLabel: "Flipping"
  },
  "dice-roller": {
    slug: "dice-roller",
    mode: "dice",
    animationLabel: "Rolling"
  },
  "random-number-generator": {
    slug: "random-number-generator",
    mode: "number",
    animationLabel: "Generating"
  },
  "yes-no-picker": {
    slug: "yes-no-picker",
    mode: "yes-no",
    animationLabel: "Deciding"
  },
  "random-choice-picker": {
    slug: "random-choice-picker",
    mode: "choice",
    animationLabel: "Picking"
  }
};

export const chanceCalculators: CalculatorDefinition[] = [
  {
    slug: "flip-a-coin",
    title: "Flip a Coin",
    shortDescription: "Heads or tails with a clean animated coin flip for quick tie-breaks and chance picks.",
    intro: "Use this coin flip tool when you need a fast 50/50 decision without overthinking the call.",
    detail: "Flip a virtual coin with a short animation, keep a recent result history, and use the outcome for quick tie-breaks, games, and lightweight decisions.",
    category: "Chance",
    searchTerms: ["flip a coin", "coin flip", "heads or tails"],
    features: ["Animated flip", "Heads or tails outcome", "Recent result history"],
    faqs: [
      {
        question: "Is the virtual coin flip random?",
        answer: "Yes. Each flip chooses heads or tails programmatically so the result is not predetermined by the interface."
      },
      {
        question: "Can I use this for tie-breakers?",
        answer: "Yes. It is designed for quick yes-or-no style tie-breaks when either option is acceptable."
      },
      {
        question: "Does it keep past flips?",
        answer: "It shows a short local history on the page so you can see the most recent outcomes during the current session."
      }
    ],
    examples: [
      {
        title: "Lunch tie-breaker",
        description: "Flip once to decide between two equally good lunch spots.",
        outcome: "Heads could mean option one, tails could mean option two."
      },
      {
        title: "Game starter",
        description: "Use the coin to decide who goes first.",
        outcome: "A quick flip settles the starting turn without manual coins nearby."
      }
    ],
    related: ["yes-no-picker", "dice-roller", "random-choice-picker"]
  },
  {
    slug: "dice-roller",
    title: "Dice Roller",
    shortDescription: "Roll common dice sizes with animation, totals, and per-die results from one screen.",
    intro: "This dice roller gives you animated digital dice for board games, tabletop sessions, classroom use, and random number needs.",
    detail: "Choose the die type, set how many dice to roll, and watch the values animate before landing on a final total and per-die breakdown.",
    category: "Chance",
    searchTerms: ["dice roller", "roll dice online", "d20 roller", "d6 roller"],
    features: ["Animated roll", "Common die sizes", "Total and per-die results"],
    faqs: [
      {
        question: "What dice types can I roll?",
        answer: "The tool supports common tabletop dice such as d4, d6, d8, d10, d12, and d20."
      },
      {
        question: "Can I roll more than one die?",
        answer: "Yes. You can roll multiple dice at once and the page will show both the total and the individual results."
      },
      {
        question: "Is this only for games?",
        answer: "No. It also works as a quick random-number source when you want a bounded result with a bit of visual feedback."
      }
    ],
    examples: [
      {
        title: "Board game turn",
        description: "Roll 2d6 for a board game movement total.",
        outcome: "You get both the combined total and the two face values."
      },
      {
        title: "Tabletop skill check",
        description: "Roll a d20 for a quick check during a session.",
        outcome: "The animation lands on a single result ready to read immediately."
      }
    ],
    related: ["random-number-generator", "flip-a-coin", "random-choice-picker"]
  },
  {
    slug: "random-number-generator",
    title: "Random Number Generator",
    shortDescription: "Generate random integers inside a custom range with animated rolling before the final number lands.",
    intro: "Use this random number generator when you need a number between two bounds without using an external app or spreadsheet.",
    detail: "Set a minimum and maximum value, run the animation, and get a random integer inside the selected range with a visible recent history.",
    category: "Chance",
    searchTerms: ["random number generator", "number picker", "random integer generator"],
    features: ["Custom range", "Animated draw", "Recent numbers"],
    faqs: [
      {
        question: "Can I set my own range?",
        answer: "Yes. Enter the minimum and maximum values and the generator will return a random integer inside that range."
      },
      {
        question: "Does it include both ends of the range?",
        answer: "Yes. The generator treats both the minimum and maximum values as possible outcomes."
      },
      {
        question: "Can I use it for giveaways or seating?",
        answer: "Yes. It works well for lightweight random assignment tasks such as queue order, raffle picks, or table numbers."
      }
    ],
    examples: [
      {
        title: "Classroom picker",
        description: "Pick a student number between 1 and 28.",
        outcome: "The generator lands on a single integer inside the selected classroom range."
      },
      {
        title: "Raffle ticket",
        description: "Generate a winning ticket number between 100 and 250.",
        outcome: "The tool gives a quick result without needing a separate randomizer app."
      }
    ],
    related: ["dice-roller", "random-choice-picker", "yes-no-picker"]
  },
  {
    slug: "yes-no-picker",
    title: "Yes or No Picker",
    shortDescription: "Animated yes-or-no randomizer for quick binary calls when you want a clean nudge either way.",
    intro: "This yes-or-no picker is built for fast binary decisions when you want the randomness to feel decisive and visible.",
    detail: "Press once and the answer animates before landing on yes or no, with a short result history to keep repeat runs readable.",
    category: "Chance",
    searchTerms: ["yes or no picker", "yes no generator", "random yes or no"],
    features: ["Animated answer", "Binary decision helper", "Recent answer history"],
    faqs: [
      {
        question: "When is this useful?",
        answer: "It is useful for low-stakes choices where either outcome is acceptable and you just want a clean nudge."
      },
      {
        question: "How is it different from a coin flip?",
        answer: "The underlying logic is similar, but the output is framed directly as yes or no instead of heads or tails."
      },
      {
        question: "Can I keep asking repeatedly?",
        answer: "Yes. The page keeps a short local history so the recent sequence stays visible."
      }
    ],
    examples: [
      {
        title: "Should we order dessert?",
        description: "Use a single yes-or-no pull for a low-stakes call.",
        outcome: "The result lands directly on yes or no without needing a separate mapping."
      },
      {
        title: "Meeting tie-breaker",
        description: "Pick between two lightweight choices framed as a yes-or-no question.",
        outcome: "The answer gives a quick nudge when the group is stuck."
      }
    ],
    related: ["flip-a-coin", "random-choice-picker", "random-number-generator"]
  },
  {
    slug: "random-choice-picker",
    title: "Random Choice Picker",
    shortDescription: "Pick one option from a custom list with animation when you have more than two possible choices.",
    intro: "Use this random choice picker when a coin flip is too limited and you need one result from a short custom list.",
    detail: "Add options separated by commas or new lines, run the picker animation, and let the tool land on one final choice while keeping the most recent picks visible.",
    category: "Chance",
    searchTerms: ["random choice picker", "random picker", "pick a random option", "random list picker"],
    features: ["Custom option list", "Animated pick", "Recent selection history"],
    faqs: [
      {
        question: "How do I add options?",
        answer: "Enter options separated by commas or line breaks and the tool will treat each one as a possible random pick."
      },
      {
        question: "Can I use this for teams or restaurants?",
        answer: "Yes. It works well for lunch spots, task owners, seating order, giveaway pools, and other small random selections."
      },
      {
        question: "Does it remove past winners automatically?",
        answer: "No. This version picks from the current list each time, so repeated runs can produce the same option unless you edit the list."
      }
    ],
    examples: [
      {
        title: "Dinner decision",
        description: "Pick between tacos, sushi, pizza, and burgers.",
        outcome: "The animated picker lands on one final option so the group can move on."
      },
      {
        title: "Task owner",
        description: "Choose one person from a short project list.",
        outcome: "The result gives a single name from the current pool."
      }
    ],
    related: ["yes-no-picker", "flip-a-coin", "random-number-generator"]
  }
];
