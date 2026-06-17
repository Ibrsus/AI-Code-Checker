// src/app/components/ModelSelector.tsx
"use client";

import { OPENROUTER_MODELS } from "@/lib/ai";

interface Props {
  value: string;
  onChange: (model: string) => void;
  disabled?: boolean;
}

export default function ModelSelector({ value, onChange, disabled }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-[#9898a8] uppercase tracking-widest">
        Model
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="
          bg-[#16161a] border border-[#2a2a30] rounded-lg px-3 py-2
          text-[#e8e8f0] text-sm font-mono
          focus:outline-none focus:border-[#7c6af7] focus:ring-1 focus:ring-[#7c6af7]
          disabled:opacity-50 disabled:cursor-not-allowed
          cursor-pointer transition-colors
        "
      >
        {OPENROUTER_MODELS.map((m) => (
          <option key={m.id} value={m.id}>
            {m.label}
          </option>
        ))}
      </select>
    </div>
  );
}
