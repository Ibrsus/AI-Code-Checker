// src/app/page.tsx
"use client";

import { useState } from "react";
import ModelSelector from "./components/ModelSelector";
import CodeInput from "./components/CodeInput";
import ReviewOutput from "./components/ReviewOutput";
import { DEFAULT_MODEL } from "@/lib/ai";

interface ReviewResult {
  review: string;
  model: string;
  provider: string;
}

export default function Home() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("auto-detect");
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleReview() {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language: language === "auto-detect" ? undefined : language,
          model,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }

      setResult(data);
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const canReview = code.trim().length > 0 && !loading;

  return (
    <main className="min-h-screen px-4 py-12 max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🔍</span>
          <h1 className="text-2xl font-bold tracking-tight text-[#e8e8f0]">
            AI Code Reviewer
          </h1>
        </div>
        <p className="text-[#9898a8] text-sm">
          Paste or upload code — get a structured review instantly.
        </p>
      </div>

      {/* Controls row */}
      <div className="mb-6">
        <ModelSelector value={model} onChange={setModel} disabled={loading} />
      </div>

      {/* Code input */}
      <div className="mb-6">
        <CodeInput
          code={code}
          language={language}
          onCodeChange={setCode}
          onLanguageChange={setLanguage}
          disabled={loading}
        />
      </div>

      {/* Review button */}
      <button
        onClick={handleReview}
        disabled={!canReview}
        className="
          w-full py-3 rounded-xl font-semibold text-sm
          bg-[#7c6af7] hover:bg-[#8f7fff] active:bg-[#6a58e0]
          text-white transition-all
          disabled:opacity-40 disabled:cursor-not-allowed
          flex items-center justify-center gap-2
        "
      >
        {loading ? (
          <>
            <svg className="spinner w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle
                className="opacity-25" cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4"
              />
              <path
                className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
              />
            </svg>
            Reviewing…
          </>
        ) : (
          "Review code →"
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="mt-6 p-4 bg-red-950/40 border border-red-800/50 rounded-xl text-red-300 text-sm fade-in">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="mt-8">
          <ReviewOutput
            review={result.review}
            model={result.model}
            provider={result.provider}
          />
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 text-center text-xs text-[#52525e]">
        Powered by{" "}
        <a
          href="https://openrouter.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#7c6af7] hover:underline"
        >
          OpenRouter
        </a>
        {" · "}
        <a
          href="https://github.com/your-username/ai-code-reviewer"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#9898a8] transition-colors"
        >
          GitHub
        </a>
      </footer>
    </main>
  );
}
