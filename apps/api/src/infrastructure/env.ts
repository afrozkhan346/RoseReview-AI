import { z } from "zod";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

/**
 * Zod schema for rigorous environment variable validation.
 * Ensures the application fails fast during startup if misconfigured.
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  APP_URL: z.string().url().default("http://localhost:3000"),
  
  // Database Configuration
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  REDIS_URL: z.string().url("REDIS_URL must be a valid URL").optional(),
  
  // External APIs
  GROQ_API_KEY: z.string().min(1, "GROQ_API_KEY is required").optional(),
  GROQ_MODEL: z.string().default("llama-3.1-70b-versatile"),
  GITHUB_TOKEN: z.string().min(1, "GITHUB_TOKEN is required").optional(),
  
  // GitHub OAuth
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  
  // API Config
  API_PREFIX: z.string().default("/api"),
  API_VERSION: z.string().default("v1"),
  
  // Security
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters long").default("fallback_secret_for_development_do_not_use_in_prod_123!"),
  ENCRYPTION_KEY: z.string().length(64, "ENCRYPTION_KEY must be a 64 character hex string (32 bytes)").default("a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4e5f6"),
  WEBHOOK_SECRET: z.string().min(1, "WEBHOOK_SECRET is required").optional(),
  
  // Logging Configuration
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
});

type EnvConfig = z.infer<typeof envSchema>;

let envConfig: EnvConfig;

try {
  envConfig = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("❌ Invalid environment configuration:");
    error.errors.forEach((e) => {
      console.error(`  - ${e.path.join(".")}: ${e.message}`);
    });
    process.exit(1);
  }
  throw error;
}

export const env = envConfig;
