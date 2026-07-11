import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader } from "~/components/shared";
import { Card, CardBody, CardHeader } from "~/components/Card";
import { Badge } from "~/components/Badge";
import { Button } from "~/components/Button";
import { Textarea } from "~/components/Input";

interface ThreadDetail {
  id: number;
  title: string;
  author_name: string;
  body: string;
  reply_count: number;
  view_count: number;
  created_at: string;
  replies: Reply[];
}

interface Reply {
  id: number;
  author_name: string;
  body: string;
  created_at: string;
}

export const Route = createFileRoute("/community/$id")({
  component: ThreadDetail,
});

function ThreadDetail() {
  const { id } = Route.useParams();
  const [thread, setThread] = useState<ThreadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyName, setReplyName] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/threads/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setThread(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyName.trim() || !replyBody.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thread_id: Number(id), author_name: replyName.trim(), body: replyBody.trim() }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to post reply");
      }
      const reply = await res.json();
      setThread((prev) => prev ? { ...prev, replies: [...prev.replies, reply], reply_count: prev.reply_count + 1 } : prev);
      setReplyBody("");
    } catch (err: any) {
      setError(err.message);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="container-narrow py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-brand-100/60 rounded w-2/3" />
          <div className="h-4 bg-brand-100/60 rounded w-1/4" />
          <div className="h-32 bg-brand-100/60 rounded" />
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="container-narrow py-8">
        <PageHeader title="Thread not found" description="This discussion thread doesn't exist or was deleted." />
        <Link to="/community"><Button>Back to Community</Button></Link>
      </div>
    );
  }

  return (
    <div className="container-narrow py-8 max-w-3xl mx-auto">
      <Link to="/community" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-brand-600 mb-6">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to Community
      </Link>

      {/* Thread */}
      <Card elevated className="mb-8">
        <CardBody>
          <h1 className="text-2xl font-bold text-text-primary mb-2">{thread.title}</h1>
          <div className="flex items-center gap-3 text-sm text-text-muted mb-4">
            <span className="font-medium text-text-secondary">{thread.author_name}</span>
            <span>·</span>
            <span>{new Date(thread.created_at).toLocaleDateString()}</span>
            <span>·</span>
            <span>{thread.reply_count} replies</span>
            <span>·</span>
            <span>{thread.view_count} views</span>
          </div>
          <div className="prose prose-sm max-w-none text-text-secondary leading-relaxed whitespace-pre-wrap">
            {thread.body}
          </div>
        </CardBody>
      </Card>

      {/* Replies */}
      <h2 className="text-lg font-semibold text-text-primary mb-4">
        Replies ({thread.replies.length})
      </h2>

      {thread.replies.length === 0 ? (
        <Card className="mb-8">
          <CardBody>
            <p className="text-sm text-text-muted text-center py-4">
              No replies yet. Be the first to respond!
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3 mb-8">
          {thread.replies.map((reply) => (
            <Card key={reply.id} className="ml-4 border-l-2 border-brand-200">
              <CardBody>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-text-primary">{reply.author_name}</span>
                  <span className="text-xs text-text-muted">{new Date(reply.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {reply.body}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Reply form */}
      <Card elevated>
        <CardHeader>
          <h3 className="text-base font-semibold text-text-primary">Post a Reply</h3>
        </CardHeader>
        <CardBody>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleReply} className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              value={replyName}
              onChange={(e) => setReplyName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-border-light text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
              required
            />
            <Textarea
              label=""
              placeholder="Share your thoughts..."
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              required
              rows={3}
            />
            <Button type="submit" isLoading={submitting} disabled={!replyName.trim() || !replyBody.trim()}>
              Post Reply
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}