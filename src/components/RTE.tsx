"use client";

import React, { useEffect, useRef } from "react";

interface RTEProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RTE({ value, onChange, placeholder, className }: RTEProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (textareaRef.current && value !== undefined && textareaRef.current.value !== value) {
      textareaRef.current.value = value;
    }
  }, [value]);

  return (
    <div className={`rounded-md border border-border bg-input overflow-hidden ${className ?? ""}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-border px-2 py-1.5 bg-secondary/50">
        {["B", "I", "Code", "Link"].map((tool) => (
          <button
            key={tool}
            type="button"
            className="px-2 py-0.5 rounded text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            {tool}
          </button>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        defaultValue={value}
        onChange={handleChange}
        placeholder={placeholder || "Write your content here... (Markdown supported)"}
        className="w-full min-h-[160px] resize-none bg-transparent px-3 py-2.5 text-sm focus:outline-none placeholder:text-muted-foreground font-mono"
      />
    </div>
  );
}