import type { Env } from "../types";
import { json, error } from "../lib/http";
import { listAnimators, getAnimator } from "../db";

export async function animators(_req: Request, env: Env): Promise<Response> {
  return json({ animators: await listAnimators(env) });
}

export async function animatorDetail(_req: Request, env: Env, username: string): Promise<Response> {
  const a = await getAnimator(env, username);
  if (!a) return error(404, "Animator not found");
  return json(a);
}
