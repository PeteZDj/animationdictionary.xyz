export interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
  SITE_ORIGIN: string;
  API_BASE: string;
  SESSION_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  RESEND_API_KEY?: string;
}

export interface SessionUser {
  uid: number;
  email: string;
  name: string;
}
