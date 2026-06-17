// src/app/components/CodeInput.tsx
"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";

interface Props {
  code: string;
  language: string;
  onCodeChange: (code: string) => void;
  onLanguageChange: (lang: string) => void;
  disabled?: boolean;
}

const LANGUAGES = [
  "auto-detect", "javascript", "typescript", "python", "rust",
  "go", "java", "c", "cpp", "csharp", "php", "ruby", "swift",
  "kotlin", "html", "css", "sql", "bash", "json", "yaml",
];

// Read a file as text
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

// Guess language from file extension
function guessLanguage(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    js: "javascript", jsx: "javascript",
    ts: "typescript", tsx: "typescript",
    py: "python", rs: "rust", go: "go",
    java: "java", c: "c", cpp: "cpp", cc: "cpp",
    cs: "csharp", php: "php", rb: "ruby",
    swift: "swift", kt: "kotlin",
    html: "html", css: "css",
    sql: "sql", sh: "bash", bash: "bash",
    json: "json", yaml: "yaml", yml: "yaml",
  };
  return map[ext] ?? "auto-detect";
}

export default function CodeInput({
  code, language, onCodeChange, onLanguageChange, disabled,
}: Props) {
  const [tab, setTab] = useState<"paste" | "upload">("paste");
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setFileError(null);
    if (file.size > 200_000) {
      setFileError("File too large (max 200 KB).");
      return;
    }
    try {
      const text = await readFileAsText(file);
      onCodeChange(text);
      setFileName(file.name);
      const guessed = guessLanguage(file.name);
      onLanguageChange(guessed);
    } catch {
      setFileError("Could not read file.");
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function onFileInput(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Tab switcher */}
      <div className="flex gap-1 bg-[#16161a] rounded-lg p-1 w-fit border border-[#2a2a30]">
        {(["paste", "upload"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            disabled={disabled}
            className={`
              px-4 py-1.5 rounded-md text-sm font-medium transition-all
              ${tab === t
                ? "bg-[#7c6af7] text-white shadow"
                : "text-[#9898a8] hover:text-[#e8e8f0]"
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {t === "paste" ? "Paste code" : "Upload file"}
          </button>
        ))}
      </div>

      {/* Language selector */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#9898a8] uppercase tracking-widest">
          Language
        </label>
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          disabled={disabled}
          className="
            bg-[#16161a] border border-[#2a2a30] rounded-lg px-3 py-2
            text-[#e8e8f0] text-sm font-mono w-48
            focus:outline-none focus:border-[#7c6af7] focus:ring-1 focus:ring-[#7c6af7]
            disabled:opacity-50 cursor-pointer transition-colors
          "
        >
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      {/* Paste tab */}
      {tab === "paste" && (
        <textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          disabled={disabled}
          placeholder="// Paste your code here..."
          spellCheck={false}
          className="
            w-full min-h-[320px] bg-[#16161a] border border-[#2a2a30] rounded-xl
            p-4 text-sm font-mono text-[#e8e8f0] placeholder-[#52525e]
            focus:outline-none focus:border-[#7c6af7] focus:ring-1 focus:ring-[#7c6af7]
            resize-y transition-colors disabled:opacity-50
            leading-relaxed
          "
        />
      )}

      {/* Upload tab */}
      {tab === "upload" && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          className={`
            flex flex-col items-center justify-center gap-3
            min-h-[200px] rounded-xl border-2 border-dashed
            cursor-pointer transition-all select-none
            ${dragOver
              ? "border-[#7c6af7] bg-[#1a1830]"
              : "border-[#2a2a30] hover:border-[#52525e] bg-[#16161a]"
            }
            ${disabled ? "opacity-50 pointer-events-none" : ""}
          `}
        >
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={onFileInput}
            accept=".js,.jsx,.ts,.tsx,.py,.rs,.go,.java,.c,.cpp,.cc,.cs,.php,.rb,.swift,.kt,.html,.css,.sql,.sh,.bash,.json,.yaml,.yml,.txt,.md"
          />
          <div className="text-4xl">📁</div>
          {fileName ? (
            <div className="text-center">
              <p className="text-[#7c6af7] font-mono text-sm font-medium">{fileName}</p>
              <p className="text-[#9898a8] text-xs mt-1">Click or drop to replace</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-[#e8e8f0] text-sm font-medium">Drop a file here</p>
              <p className="text-[#9898a8] text-xs mt-1">or click to browse</p>
              <p className="text-[#52525e] text-xs mt-3">Max 200 KB · Most code file types</p>
            </div>
          )}
          {fileError && (
            <p className="text-red-400 text-xs">{fileError}</p>
          )}
        </div>
      )}

      {/* Show loaded code preview when file uploaded */}
      {tab === "upload" && code && (
        <div className="rounded-xl border border-[#2a2a30] bg-[#16161a] p-4 overflow-auto max-h-48">
          <pre className="text-xs font-mono text-[#9898a8] whitespace-pre-wrap">
            {code.slice(0, 800)}{code.length > 800 ? "\n…" : ""}
          </pre>
        </div>
      )}
    </div>
  );
}
