// src/lib/ai.ts
/// <reference types="node" />
import OpenAI from "openai";

export type Provider = "openrouter" | "ollama";

export interface ReviewRequest {
  code: string;
  language?: string;
  model: string;
}

export interface ReviewResponse {
  review: string;
  model: string;
  provider: Provider;
}

// ─── OpenRouter models available in the selector ─────────────
export const OPENROUTER_MODELS = [
  { id: "qwen/qwen3-coder:free",                  label: "Qwen3 Coder (Best overall for code review)" },
  { id: "deepseek/deepseek-r1:free",              label: "DeepSeek R1 (Deep reasoning)"               },
  { id: "deepseek/deepseek-v3:free",              label: "DeepSeek V3 (Balanced)"                     },
  { id: "meta-llama/llama-3.3-70b-instruct:free", label: "LLaMA 3.3 70B (High quality)"              },
  { id: "google/gemma-3-27b-it:free",             label: "Gemma 3 (Stable fallback)"                  },
  { id: "mistralai/mistral-7b-instruct:free",     label: "Mistral 7B (Fast fallback)"                 },
] as const;

export const DEFAULT_MODEL = "qwen/qwen3-coder:free";

// ─── Build the client based on provider ──────────────────────
function getClient(): { client: InstanceType<typeof OpenAI>; provider: Provider } {
  const provider = (process.env.AI_PROVIDER ?? "openrouter") as Provider;

  if (provider === "ollama") {
    return {
      client: new OpenAI({
        baseURL: (process.env.OLLAMA_BASE_URL ?? "http://localhost:11434") + "/v1",
        apiKey: "ollama",
      }),
      provider,
    };
  }

  return {
    client: new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY ?? "",
      defaultHeaders: {
        "HTTP-Referer": "https://github.com/IBRSUS/ai-code-reviewer",
        "X-Title": "AI Code Reviewer",
      },
    }),
    provider,
  };
}

// ─── System prompt ────────────────────────────────────────────
function buildSystemPrompt(): string {
  return `You are an expert code reviewer with deep knowledge across languages and paradigms.

When reviewing code, structure your response with these sections:

## Summary
A 2-3 sentence overview of what the code does and its overall quality.

## Issues
List bugs, security vulnerabilities, and correctness problems. For each:
- **Severity**: Critical / High / Medium / Low
- **Line(s)**: Reference specific lines where possible
- **Problem**: What's wrong
- **Fix**: Concrete suggestion or corrected snippet

## Improvements
Style, performance, readability, and maintainability suggestions. Be specific.

## Strengths
What the code does well. Always include at least one thing.

Be direct and actionable. Skip filler phrases. If the code is clean, say so clearly.`;
}

// ─── Main review function ─────────────────────────────────────
export async function reviewCode({
  code,
  language,
  model,
}: ReviewRequest): Promise<ReviewResponse> {
  const { client, provider } = getClient();

  const resolvedModel =
    provider === "ollama"
      ? (process.env.OLLAMA_MODEL ?? "qwen3:8b")
      : model;

  const completion = await client.chat.completions.create({
    model: resolvedModel,
    messages: [
      { role: "system", content: buildSystemPrompt() },
      {
        role: "user",
        content: language
          ? `Please review this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``
          : `Please review this code:\n\n\`\`\`\n${code}\n\`\`\``,
      },
    ],
    temperature: 0.3,
  });

  const review = completion.choices[0]?.message?.content ?? "No response received.";
  return { review, model: resolvedModel, provider };
}
