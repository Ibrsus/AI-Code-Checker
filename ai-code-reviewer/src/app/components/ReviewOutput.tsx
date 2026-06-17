// src/app/components/ReviewOutput.tsx
"use client";

interface Props {
  review: string;
  model: string;
  provider: string;
}

// Minimal markdown → HTML (no external dep needed)
function renderMarkdown(md: string): string {
  return md
    // Headings
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h2>$1</h2>")
    // Bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Code blocks
    .replace(/```[\w]*\n([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
    // Unordered lists
    .replace(/^\s*[-*] (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]*?<\/li>)(\n(?!<li>)|$)/g, "<ul>$1</ul>")
    // Paragraphs (lines not already tagged)
    .replace(/^(?!<[a-z])(.*\S.*)$/gm, "<p>$1</p>")
    // Clean up extra blank lines
    .replace(/\n{3,}/g, "\n\n");
}

export default function ReviewOutput({ review, model, provider }: Props) {
  const html = renderMarkdown(review);

  return (
    <div className="flex flex-col gap-4 fade-in">
      {/* Meta bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs text-[#9898a8] uppercase tracking-widest font-medium">
          Review
        </span>
        <span className="text-xs bg-[#1e1e26] border border-[#2a2a30] text-[#7c6af7] font-mono px-2 py-0.5 rounded">
          {model}
        </span>
        <span className="text-xs text-[#52525e]">via {provider}</span>
      </div>

      {/* Review content */}
      <div
        className="review-output bg-[#16161a] border border-[#2a2a30] rounded-xl p-6"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Copy button */}
      <button
        onClick={() => navigator.clipboard.writeText(review)}
        className="
          self-start text-xs text-[#9898a8] hover:text-[#e8e8f0]
          border border-[#2a2a30] hover:border-[#52525e]
          px-3 py-1.5 rounded-lg transition-colors
        "
      >
        Copy raw
      </button>
    </div>
  );
}
