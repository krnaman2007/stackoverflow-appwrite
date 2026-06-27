"use client";

import { useAuthStore } from "@/store/Auth";
import { useRouter } from "next/navigation";
import React, { useState, useRef } from "react";
import RTE from "./RTE";
import { IconX, IconLoader2, IconPhoto } from "@tabler/icons-react";
import { storage } from "@/models/client/config";
import { questionAttachmentBucket } from "@/models/name";
import { ID } from "appwrite";
import slugify from "@/lib/slugify";

interface QuestionFormProps {
  question?: any; // for edit mode
}

export default function QuestionForm({ question }: QuestionFormProps) {
  const { user, jwt } = useAuthStore();
  const router = useRouter();

  const [title, setTitle] = useState(question?.title ?? "");
  const [content, setContent] = useState(question?.content ?? "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(question?.tags ?? []);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const addTag = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
      if (!tags.includes(tag) && tags.length < 5) {
        setTags([...tags, tag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !jwt) { router.push("/login"); return; }
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let attachmentId: string | undefined;

      if (attachment) {
        const uploaded = await storage.createFile(
          questionAttachmentBucket,
          ID.unique(),
          attachment
        );
        attachmentId = uploaded.$id;
      }

      const endpoint = question ? `/api/question/${question.$id}` : "/api/question";
      const method = question ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-appwrite-user-jwt": jwt,
        },
        body: JSON.stringify({
          title,
          content,
          tags,
          authorId: user.$id,
          attachmentId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      router.push(`/questions/${data.$id}/${slugify(data.title)}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-1.5">
          Title <span className="text-destructive">*</span>
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. How do I fix a CORS error in Next.js?"
          className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
          maxLength={150}
        />
        <p className="text-xs text-muted-foreground mt-1">{title.length}/150</p>
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium mb-1.5">
          Details <span className="text-destructive">*</span>
        </label>
        <RTE
          value={content}
          onChange={setContent}
          placeholder="Describe your problem in detail. Include what you've tried and what you expect to happen..."
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium mb-1.5">
          Tags <span className="text-muted-foreground font-normal">(up to 5)</span>
        </label>
        <div className="flex flex-wrap gap-1.5 p-2 rounded-md border border-border bg-input min-h-[40px]">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 rounded-sm bg-primary/15 px-2 py-0.5 text-xs text-primary"
            >
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive">
                <IconX size={11} />
              </button>
            </span>
          ))}
          {tags.length < 5 && (
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              placeholder={tags.length === 0 ? "Type tag and press Enter..." : ""}
              className="flex-1 min-w-[120px] bg-transparent text-xs focus:outline-none placeholder:text-muted-foreground"
            />
          )}
        </div>
      </div>

      {/* Attachment */}
      <div>
        <label className="block text-sm font-medium mb-1.5">
          Attachment <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <div
          className="flex items-center gap-2 cursor-pointer rounded-md border border-dashed border-border px-4 py-3 hover:border-primary/50 transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          <IconPhoto size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {attachment ? attachment.name : "Click to upload image (jpg, png, gif, webp)"}
          </span>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {loading && <IconLoader2 size={14} className="animate-spin" />}
          {question ? "Update Question" : "Post Question"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}