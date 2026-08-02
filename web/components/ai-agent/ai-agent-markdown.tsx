"use client";

import { cn } from "@/lib/utils";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type AiAgentMarkdownProps = {
  content: string;
  variant: "user" | "agent";
};

function buildComponents(variant: "user" | "agent"): Components {
  const onPrimary = variant === "user";
  const codeBg = onPrimary ? "bg-primary-foreground/15" : "bg-muted";
  const preBg = onPrimary
    ? "bg-primary-foreground/10"
    : "border border-border/60 bg-muted/60";
  const linkClass = onPrimary
    ? "text-primary-foreground underline underline-offset-2"
    : "text-primary underline underline-offset-2";
  const blockquoteBorder = onPrimary ? "border-primary-foreground/40" : "border-primary/40";

  return {
    p: ({ children }) => <p className="mb-2 leading-relaxed last:mb-0">{children}</p>,
    ul: ({ children }) => (
      <ul className="mb-2 ml-4 list-disc space-y-1 leading-relaxed last:mb-0">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-2 ml-4 list-decimal space-y-1 leading-relaxed last:mb-0">{children}</ol>
    ),
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    h1: ({ children }) => (
      <h3 className="mb-2 text-base font-semibold leading-snug last:mb-0">{children}</h3>
    ),
    h2: ({ children }) => (
      <h4 className="mb-2 text-sm font-semibold leading-snug last:mb-0">{children}</h4>
    ),
    h3: ({ children }) => (
      <h5 className="mb-2 text-sm font-medium leading-snug last:mb-0">{children}</h5>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className={cn(
          "mb-2 border-l-4 pl-3 leading-relaxed last:mb-0",
          blockquoteBorder,
          onPrimary ? "text-primary-foreground/90" : "text-muted-foreground",
        )}
      >
        {children}
      </blockquote>
    ),
    hr: () => (
      <hr
        className={cn(
          "my-3 border-0 border-t",
          onPrimary ? "border-primary-foreground/25" : "border-border/60",
        )}
      />
    ),
    a: ({ href, children }) => (
      <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {children}
      </a>
    ),
    code: ({ className, children }) => {
      const inline = !className;
      if (inline) {
        return (
          <code className={cn("rounded px-1 py-0.5 font-mono text-xs", codeBg)}>{children}</code>
        );
      }
      return <code className={cn("font-mono text-xs", className)}>{children}</code>;
    },
    pre: ({ children }) => (
      <pre className={cn("mb-2 overflow-x-auto rounded-lg p-3 text-xs last:mb-0", preBg)}>
        {children}
      </pre>
    ),
    table: ({ children }) => (
      <div className="mb-2 w-full overflow-x-auto last:mb-0">
        <table className="w-full border-collapse text-xs">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className={onPrimary ? "bg-primary-foreground/10" : "bg-muted/80"}>{children}</thead>
    ),
    th: ({ children }) => (
      <th className="border border-border/60 px-2 py-1 text-left font-semibold">{children}</th>
    ),
    td: ({ children }) => (
      <td className="border border-border/60 px-2 py-1 align-top">{children}</td>
    ),
  };
}

export function AiAgentMarkdown({ content, variant }: AiAgentMarkdownProps) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={buildComponents(variant)}>
      {content}
    </ReactMarkdown>
  );
}
