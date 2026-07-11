import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "~/components/Button";
import { Textarea } from "~/components/Input";

export const Route = createFileRoute("/community/new")({
  component: NewThread,
});

function NewThread() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !authorName.trim() || !body.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          author_name: authorName.trim(),
          body: body.trim(),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create thread");
      }
      const thread = await res.json();
      navigate({ to: `/community/${thread.id}` });
    } catch (err: any) {
      setError(err.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Link
        to="/community"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-brand-600 mb-6"
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to Community
      </Link>

      <h1 className="text-2xl font-bold text-text-primary mb-6">Start a Discussion</h1>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">Title</label>
          <input
            type="text"
            placeholder="What's on your mind?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-border-light text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">Your Name</label>
          <input
            type="text"
            placeholder="How should others address you?"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-border-light text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">Your Post</label>
          <Textarea
            label=""
            placeholder="Share your experience, ask a question, or start a conversation..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={6}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" isLoading={submitting} disabled={!title.trim() || !authorName.trim() || !body.trim()}>
            Post Thread
          </Button>
          <Link to="/community" className="text-sm text-text-muted hover:text-text-primary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}