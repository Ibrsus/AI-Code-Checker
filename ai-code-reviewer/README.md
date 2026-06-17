# 🔍 AI Code Reviewer

Paste or upload code and get an instant structured AI review — powered by OpenRouter in production and Ollama locally.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **Paste or upload** — text box or drag-and-drop file input
- **Model selector** — switch between free models (Qwen3 Coder, DeepSeek R1, LLaMA 70B, and more)
- **Structured reviews** — Summary, Issues (with severity), Improvements, Strengths
- **Dual provider** — OpenRouter for production, Ollama for local dev (zero cost, no rate limits)

## Quick start

```bash
git clone https://github.com/your-username/ai-code-reviewer
cd ai-code-reviewer
npm install
cp .env.local.example .env.local
# Fill in your keys (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

```bash
# "openrouter" | "ollama"
AI_PROVIDER=openrouter

# Get a free key at openrouter.ai
OPENROUTER_API_KEY=sk-or-...

# Ollama (local dev only)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen3:8b
```

## Local dev with Ollama (free, no rate limits)

```bash
# 1. Install Ollama from ollama.com
# 2. Pull a model
ollama pull qwen3:8b

# 3. Set in .env.local
AI_PROVIDER=ollama
OLLAMA_MODEL=qwen3:8b

# 4. Run
npm run dev
```

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/ai-code-reviewer&env=AI_PROVIDER,OPENROUTER_API_KEY)

Set `AI_PROVIDER=openrouter` and your `OPENROUTER_API_KEY` in the Vercel dashboard env vars.

## Stack

- **Next.js 14** — App Router, API routes
- **TypeScript** — end to end
- **Tailwind CSS** — styling
- **OpenAI SDK** — compatible with both OpenRouter and Ollama

## Adding models

Edit `src/lib/ai.ts` → `OPENROUTER_MODELS` array. Any model on [openrouter.ai/models](https://openrouter.ai/models) works.

## License

MIT
