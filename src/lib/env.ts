import { z } from "zod";

const runtimeEnvSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_TEST_MODEL: z.string().min(1).default("gpt-5-mini"),
  OPENAI_VISION_MODEL: z.string().min(1).default("gpt-5-mini"),
  BLOB_READ_WRITE_TOKEN: z.string().min(1),
  AUTH_SECRET: z.string().min(32),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000")
});

export function getRuntimeEnv() {
  return runtimeEnvSchema.parse(process.env);
}

export function getAuthSecret() {
  const value = process.env.AUTH_SECRET;

  if (!value || value.length < 32) {
    throw new Error("AUTH_SECRET must be set to a strong value of at least 32 characters.");
  }

  return value;
}

export function getOpenAIConfig() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required for AI generation, OCR, and evaluation.");
  }

  return {
    apiKey,
    testModel: process.env.OPENAI_TEST_MODEL || "gpt-5-mini",
    visionModel: process.env.OPENAI_VISION_MODEL || "gpt-5-mini"
  };
}

export function getBlobToken() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is required for answer image uploads.");
  }

  return token;
}
