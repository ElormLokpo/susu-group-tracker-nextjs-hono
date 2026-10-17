import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().positive(),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  ALLOWED_DOMAINS: z.string().transform((value) =>
    value
      .split(",")
      .map((domain) => domain.trim())
      .filter(Boolean),
  ),
  DATABASE_URL: z.string().min(1, { message: "Database url is required" }),

  GOOGLE_CLIENT_ID: z
    .string()
    .min(1, { message: "Google client id is required" }),
  GOOGLE_CLIENT_SECRET: z
    .string()
    .min(1, { message: "Google client secret is required" }),
  GOOGLE_REDIRECT_URI: z
    .string()
    .min(1, { message: "Google redirect uri is required" }),
  GOOGLE_AUTH_URL: z
    .string()
    .min(1, { message: "Google auth url is required" }),
  GOOGLE_TOKEN_URL: z
    .string()
    .min(1, { message: "Google token url is required" }),
  GOOGLE_USERINFO_URL: z
    .string()
    .min(1, { message: "Google userinfo url is required" }),

  JWT_SECRET: z.string().min(1, { message: "JWT secret is required" }),
  FRONTEND_URL_LOCAL: z.string(),
  FRONTEND_URL_PROD: z.string(),
  EMAIL_API_KEY: z.string().min(1, { message: "Email api key is required" }),
});

export const env = envSchema.parse(process.env);
