import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";

interface Thread {
  id: number;
  title: string;
  author_name: string;
  body: string;
  created_at: string;
  reply_count: number;
}

export const Route = createFileRoute("/community")({
  component: Community,
});

function Community() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/threads")
      .then((r) => r.json())
      .then(setThreads)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Community</h1>
          <p className="text-sm text-text-muted mt-1">
            Connect with others managing MCAS and histamine intolerance
          </p>
        </div>
        <Link
          to="/community/new"
          className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
        >
          New Thread
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-brand-300 border-t-brand-600 rounded-full animate-spin" />
        </div>
      ) : threads.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-3">💬</div>
          <h2 className="text-lg font-semibold text-text-primary mb-1">No discussions yet</h2>
          <p className="text-sm text-text-muted mb-4">
            Be the first to start a conversation
          </p>
          <Link
            to="/community/new"
            className="inline-block rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
          >
            Start a Thread
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {threads.map((thread) => (
            <Link
              key={thread.id}
              to={`/community/${thread.id}`}
              className="block rounded-2xl border border-border-primary bg-surface p-4 hover:border-brand-200 hover:shadow-sm transition-all"
            >
              <h3 className="font-semibold text-text-primary">{thread.title}</h3>
              <p className="text-sm text-text-muted mt-1 line-clamp-2">{thread.body}</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-text-muted">
                <span>{thread.author_name}</span>
                <span>·</span>
                <span>{new Date(thread.created_at).toLocaleDateString()}</span>
                <span>·</span>
                <span>{thread.reply_count} {thread.reply_count === 1 ? "reply" : "replies"}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}