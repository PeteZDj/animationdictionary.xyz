import { DictionaryClient } from "./dictionary-client";
import { COVERAGE } from "@/data/dictionary";

export const metadata = {
  title: "Dictionary Coverage · AnimationDictionary.xyz",
  description:
    "Track how much of the English dictionary has animations, see how many clips exist per word, and claim an open word to animate.",
};

export default function DictionaryPage() {
  // touch COVERAGE so the static page is regenerated when the lexicon changes
  void COVERAGE.lexiconSize;
  return <DictionaryClient />;
}
