import type { LifeDecisionCalculatorSlug } from "@/data/life-decision-config";

export type DecisionGuidedAnswer = "a" | "tie" | "b";

export interface DecisionGuidedChoice {
  answer: DecisionGuidedAnswer;
  label: string;
  description?: string;
}

export const decisionGuidedChoices: Record<LifeDecisionCalculatorSlug, Record<string, DecisionGuidedChoice[]>> = {
  "quit-job-calculator": {
    compensation: [
      { answer: "b", label: "Hard to walk away from" },
      { answer: "tie", label: "About fair for now" },
      { answer: "a", label: "Not enough to keep me here" }
    ],
    growth: [
      { answer: "b", label: "Still strong growth here" },
      { answer: "tie", label: "Some growth, but limited" },
      { answer: "a", label: "Growth feels stalled" }
    ],
    manager: [
      { answer: "b", label: "Manager makes staying workable" },
      { answer: "tie", label: "Mixed experience" },
      { answer: "a", label: "Manager makes me want out" }
    ],
    flexibility: [
      { answer: "b", label: "This job still fits my life" },
      { answer: "tie", label: "Manageable enough" },
      { answer: "a", label: "Too rigid for my life" }
    ],
    stress: [
      { answer: "b", label: "Stress is reasonable" },
      { answer: "tie", label: "Hard but manageable" },
      { answer: "a", label: "Unsustainably high" }
    ],
    burnout: [
      { answer: "b", label: "Burnout risk feels low" },
      { answer: "tie", label: "I need better recovery" },
      { answer: "a", label: "Real burnout risk" }
    ],
    runway: [
      { answer: "b", label: "Not enough buffer yet" },
      { answer: "tie", label: "Some buffer, but thin" },
      { answer: "a", label: "Enough savings to leave" }
    ],
    jobmarket: [
      { answer: "b", label: "Poor time to leave" },
      { answer: "tie", label: "Unclear market" },
      { answer: "a", label: "Good chance of something better" }
    ]
  },
  "move-calculator": {
    cost: [
      { answer: "b", label: "Too high" },
      { answer: "tie", label: "Manageable" },
      { answer: "a", label: "Within my means" }
    ],
    income: [
      { answer: "b", label: "Small or nonexistent" },
      { answer: "tie", label: "No real change" },
      { answer: "a", label: "Expected increase" }
    ],
    support: [
      { answer: "b", label: "I would lose too much support" },
      { answer: "tie", label: "Support would be similar" },
      { answer: "a", label: "I would still have strong support" }
    ],
    fit: [
      { answer: "b", label: "Does not fit my life" },
      { answer: "tie", label: "Could work either way" },
      { answer: "a", label: "Strong fit for me" }
    ],
    safety: [
      { answer: "b", label: "Feels less safe" },
      { answer: "tie", label: "About the same" },
      { answer: "a", label: "Feels safer" }
    ],
    housing: [
      { answer: "b", label: "Not worth the housing tradeoff" },
      { answer: "tie", label: "About the same setup" },
      { answer: "a", label: "Better living situation" }
    ],
    career: [
      { answer: "b", label: "Fewer opportunities there" },
      { answer: "tie", label: "No real advantage" },
      { answer: "a", label: "More opportunities there" }
    ],
    stress: [
      { answer: "b", label: "Too disruptive right now" },
      { answer: "tie", label: "Manageable disruption" },
      { answer: "a", label: "Worth the disruption" }
    ]
  },
  "get-married-calculator": {
    values: [
      { answer: "b", label: "Too many differences" },
      { answer: "tie", label: "Mostly aligned" },
      { answer: "a", label: "Very aligned" }
    ],
    conflict: [
      { answer: "b", label: "Repair still needs work" },
      { answer: "tie", label: "Sometimes healthy, sometimes not" },
      { answer: "a", label: "We repair conflict well" }
    ],
    trust: [
      { answer: "b", label: "Trust is not solid" },
      { answer: "tie", label: "Mostly trustworthy" },
      { answer: "a", label: "Trust feels strong" }
    ],
    money: [
      { answer: "b", label: "Not financially ready" },
      { answer: "tie", label: "Manageable but needs work" },
      { answer: "a", label: "Financially ready enough" }
    ],
    goals: [
      { answer: "b", label: "Future plans do not line up" },
      { answer: "tie", label: "Some big things still open" },
      { answer: "a", label: "Long-term plans line up" }
    ],
    family: [
      { answer: "b", label: "Too much outside friction" },
      { answer: "tie", label: "Manageable but present" },
      { answer: "a", label: "Boundaries feel workable" }
    ],
    joy: [
      { answer: "b", label: "Connection feels inconsistent" },
      { answer: "tie", label: "Good but not steady" },
      { answer: "a", label: "Connection feels strong" }
    ],
    timing: [
      { answer: "b", label: "Timing feels off" },
      { answer: "tie", label: "Could work but not ideal" },
      { answer: "a", label: "Timing feels right" }
    ]
  },
  "have-kids-calculator": {
    desire: [
      { answer: "b", label: "Not a clear yes yet" },
      { answer: "tie", label: "Still figuring it out" },
      { answer: "a", label: "Strong and durable yes" }
    ],
    relationship: [
      { answer: "b", label: "Too shaky right now" },
      { answer: "tie", label: "Stable but needs work" },
      { answer: "a", label: "Strong enough for this" }
    ],
    support: [
      { answer: "b", label: "Not enough support" },
      { answer: "tie", label: "Some support, but thin" },
      { answer: "a", label: "Strong support system" }
    ],
    money: [
      { answer: "b", label: "Too tight right now" },
      { answer: "tie", label: "Manageable with tradeoffs" },
      { answer: "a", label: "Financially workable" }
    ],
    housing: [
      { answer: "b", label: "Current setup is not ready" },
      { answer: "tie", label: "Could make it work" },
      { answer: "a", label: "Home fits this stage" }
    ],
    health: [
      { answer: "b", label: "Health or timing says wait" },
      { answer: "tie", label: "Unclear or mixed" },
      { answer: "a", label: "Health and timing support sooner" }
    ],
    career: [
      { answer: "b", label: "Career would take too much strain" },
      { answer: "tie", label: "Possible but disruptive" },
      { answer: "a", label: "Work is flexible enough" }
    ],
    bandwidth: [
      { answer: "b", label: "I do not have the bandwidth" },
      { answer: "tie", label: "Maybe, but stretched" },
      { answer: "a", label: "I have the energy for this" }
    ]
  },
  "buy-a-house-readiness-calculator": {
    stability: [
      { answer: "b", label: "Too likely to move again" },
      { answer: "tie", label: "Not fully sure yet" },
      { answer: "a", label: "Likely to stay put" }
    ],
    cash: [
      { answer: "b", label: "Cash is too thin" },
      { answer: "tie", label: "Enough, but tight" },
      { answer: "a", label: "Cash reserves look solid" }
    ],
    payment: [
      { answer: "b", label: "Monthly cost feels too heavy" },
      { answer: "tie", label: "Manageable but not comfortable" },
      { answer: "a", label: "Comfortably affordable" }
    ],
    maintenance: [
      { answer: "b", label: "I do not want the upkeep" },
      { answer: "tie", label: "Could handle some of it" },
      { answer: "a", label: "Ready for ownership upkeep" }
    ],
    mobility: [
      { answer: "b", label: "I still need flexibility" },
      { answer: "tie", label: "Flexibility matters somewhat" },
      { answer: "a", label: "Ready to stay put" }
    ],
    ownership: [
      { answer: "b", label: "I do not care enough about owning" },
      { answer: "tie", label: "Owning would be nice" },
      { answer: "a", label: "I strongly want to own" }
    ],
    market: [
      { answer: "b", label: "This market feels too risky" },
      { answer: "tie", label: "Unsure about conditions" },
      { answer: "a", label: "Comfortable buying in this market" }
    ],
    space: [
      { answer: "b", label: "Current place still works" },
      { answer: "tie", label: "Starting to feel tight" },
      { answer: "a", label: "Current place no longer fits" }
    ]
  },
  "start-a-business-calculator": {
    runway: [
      { answer: "b", label: "Not enough runway" },
      { answer: "tie", label: "Some runway, but thin" },
      { answer: "a", label: "Enough runway to start" }
    ],
    proof: [
      { answer: "b", label: "Not enough proof yet" },
      { answer: "tie", label: "Some signs, but not enough" },
      { answer: "a", label: "Clear customer demand" }
    ],
    skills: [
      { answer: "b", label: "Too many gaps right now" },
      { answer: "tie", label: "Some gaps, but manageable" },
      { answer: "a", label: "I can execute this" }
    ],
    time: [
      { answer: "b", label: "I do not have the time" },
      { answer: "tie", label: "Possible but stretched" },
      { answer: "a", label: "I have the time to do it" }
    ],
    desire: [
      { answer: "b", label: "Excited but not committed" },
      { answer: "tie", label: "Interested, but unsure" },
      { answer: "a", label: "Strong commitment to build this" }
    ],
    support: [
      { answer: "b", label: "Not enough support around me" },
      { answer: "tie", label: "Mixed support" },
      { answer: "a", label: "Strong support for the risk" }
    ],
    debt: [
      { answer: "b", label: "Debt makes this too risky" },
      { answer: "tie", label: "Debt is manageable but real" },
      { answer: "a", label: "Debt pressure is low enough" }
    ],
    upside: [
      { answer: "b", label: "Not strong enough yet" },
      { answer: "tie", label: "Promising but unproven" },
      { answer: "a", label: "Strong enough to justify starting" }
    ]
  },
  "go-back-to-school-calculator": {
    career: [
      { answer: "b", label: "Unclear career payoff" },
      { answer: "tie", label: "Some payoff, but uncertain" },
      { answer: "a", label: "Clear payoff from school" }
    ],
    debt: [
      { answer: "b", label: "Debt would be too heavy" },
      { answer: "tie", label: "Debt is possible but uncomfortable" },
      { answer: "a", label: "Debt looks manageable" }
    ],
    interest: [
      { answer: "b", label: "I want the idea, not the work" },
      { answer: "tie", label: "Interested but still unsure" },
      { answer: "a", label: "I genuinely want this path" }
    ],
    time: [
      { answer: "b", label: "I do not have the time" },
      { answer: "tie", label: "I could do it, but stretched" },
      { answer: "a", label: "I have the time for it" }
    ],
    income: [
      { answer: "b", label: "Lost income would hurt too much" },
      { answer: "tie", label: "Could absorb it with tradeoffs" },
      { answer: "a", label: "I can handle the income hit" }
    ],
    urgency: [
      { answer: "b", label: "School is not necessary yet" },
      { answer: "tie", label: "Maybe helpful, not essential" },
      { answer: "a", label: "This credential is needed now" }
    ],
    support: [
      { answer: "b", label: "Not enough support or logistics" },
      { answer: "tie", label: "Some support, but thin" },
      { answer: "a", label: "Support is in place" }
    ],
    stamina: [
      { answer: "b", label: "I do not have the energy" },
      { answer: "tie", label: "Maybe, but it would be hard" },
      { answer: "a", label: "I have the energy for it" }
    ]
  },
  "job-offer-calculator": {
    pay: [
      { answer: "b", label: "Not enough upside" },
      { answer: "tie", label: "Some upside, but limited" },
      { answer: "a", label: "Meaningful compensation increase" }
    ],
    takehome: [
      { answer: "b", label: "Little real take-home gain" },
      { answer: "tie", label: "Some gain, but modest" },
      { answer: "a", label: "Clear take-home improvement" }
    ],
    manager: [
      { answer: "b", label: "Manager situation seems worse" },
      { answer: "tie", label: "Too uncertain to call" },
      { answer: "a", label: "Manager situation seems better" }
    ],
    growth: [
      { answer: "b", label: "No better growth path" },
      { answer: "tie", label: "Some growth, but similar" },
      { answer: "a", label: "Clearly better growth path" }
    ],
    flexibility: [
      { answer: "b", label: "Less flexible than now" },
      { answer: "tie", label: "About the same flexibility" },
      { answer: "a", label: "More flexible than now" }
    ],
    stress: [
      { answer: "b", label: "Would likely be more stressful" },
      { answer: "tie", label: "Stress looks similar" },
      { answer: "a", label: "Stress looks manageable" }
    ],
    mission: [
      { answer: "b", label: "The work does not pull me in" },
      { answer: "tie", label: "Neutral on the mission" },
      { answer: "a", label: "The mission genuinely fits me" }
    ],
    risk: [
      { answer: "b", label: "Company feels less stable" },
      { answer: "tie", label: "Stability is unclear" },
      { answer: "a", label: "Company feels stable enough" }
    ]
  },
  "break-up-calculator": {
    trust: [
      { answer: "b", label: "Trust still feels solid" },
      { answer: "tie", label: "Trust is shaky" },
      { answer: "a", label: "Trust is broken" }
    ],
    safety: [
      { answer: "b", label: "I still feel safe here" },
      { answer: "tie", label: "Safety feels mixed" },
      { answer: "a", label: "I do not feel emotionally safe" }
    ],
    communication: [
      { answer: "b", label: "We still communicate well" },
      { answer: "tie", label: "Communication is inconsistent" },
      { answer: "a", label: "Communication keeps failing" }
    ],
    future: [
      { answer: "b", label: "We still want the same future" },
      { answer: "tie", label: "Future feels uncertain" },
      { answer: "a", label: "Our futures do not line up" }
    ],
    joy: [
      { answer: "b", label: "The relationship still feels good" },
      { answer: "tie", label: "Good moments, but uneven" },
      { answer: "a", label: "It no longer feels good to live in" }
    ],
    repair: [
      { answer: "b", label: "Both of us are doing the work" },
      { answer: "tie", label: "Only partial effort" },
      { answer: "a", label: "Repair effort is not really there" }
    ],
    support: [
      { answer: "b", label: "I do not have enough support to leave" },
      { answer: "tie", label: "Some support, but thin" },
      { answer: "a", label: "I have support if I leave" }
    ],
    clarity: [
      { answer: "b", label: "I still want to stay" },
      { answer: "tie", label: "I am conflicted" },
      { answer: "a", label: "I already know it is over" }
    ]
  },
  "retire-early-calculator": {
    assets: [
      { answer: "b", label: "Not enough saved yet" },
      { answer: "tie", label: "Close but not quite there" },
      { answer: "a", label: "Assets look ready" }
    ],
    spending: [
      { answer: "b", label: "Spending is not stable enough" },
      { answer: "tie", label: "Mostly workable, still needs testing" },
      { answer: "a", label: "Spending feels sustainable" }
    ],
    healthcare: [
      { answer: "b", label: "Healthcare plan is too weak" },
      { answer: "tie", label: "Possible but uncertain" },
      { answer: "a", label: "Healthcare plan looks solid" }
    ],
    purpose: [
      { answer: "b", label: "I would feel unmoored" },
      { answer: "tie", label: "I have some ideas, but not enough" },
      { answer: "a", label: "I know what retirement is for" }
    ],
    flexincome: [
      { answer: "b", label: "No real backup income" },
      { answer: "tie", label: "Some backup options" },
      { answer: "a", label: "Good backup income options" }
    ],
    burnout: [
      { answer: "b", label: "I can keep working okay" },
      { answer: "tie", label: "I am feeling worn down" },
      { answer: "a", label: "Staying longer is costing me too much" }
    ],
    family: [
      { answer: "b", label: "Family is not aligned yet" },
      { answer: "tie", label: "Some alignment, some concern" },
      { answer: "a", label: "Family is aligned with this" }
    ],
    market: [
      { answer: "b", label: "Market swings would rattle me" },
      { answer: "tie", label: "I could tolerate some risk" },
      { answer: "a", label: "I can handle market volatility" }
    ]
  }
};