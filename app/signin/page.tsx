import { SignInClient } from "./signin-client";

export const metadata = {
  title: "Sign in · AnimationDictionary.xyz",
  description: "Sign in to claim words, download rigs, and upload animations.",
};

export default function SignInPage() {
  return <SignInClient />;
}
