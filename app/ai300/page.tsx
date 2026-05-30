import { ArmyClient } from "./army-client";

export const metadata = {
  title: "The AI-300 Army · AnimationDictionary.xyz",
  description:
    "Draft your battalion of AI animation units. Inspect each bot's class and combat stats, then enlist them into your army.",
};

export default function AI300Page() {
  return <ArmyClient />;
}
