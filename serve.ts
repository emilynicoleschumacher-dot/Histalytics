// Production server for the built SPA site.
// Serves static client assets from dist/ and falls back to index.html for
// client-side routing (SPA fallback).
//
// Run `bun run build` before starting. Restart it with `bun run publish`.
//
// Starting a new instance supersedes the old one: it frees the port no matter
// which user owns the current server, so publish never collides with an
// already-running server. Every sandbox user has passwordless sudo, so
// the takeover works across user boundaries.
const PORT = 3000;
const HOST = "0.0.0.0";
const DIST_DIR = `${import.meta.dir}/dist`;
const FALLBACK_HTML = `${DIST_DIR}/index.html`;

// Free PORT regardless of which user owns the current listener.
const freePort =
  `for _ in $(seq 1 25); do ` +
  `pids=$(lsof -t -iTCP:${String(PORT)} -sTCP:LISTEN 2>/dev/null || true); ` +
  `if [ -z "$pids" ]; then exit 0; fi; ` +
  `kill $pids 2>/dev/null || true; sleep 0.2; ` +
  `done`;

for (let attempt = 1; ; attempt++) {
  await Bun.$`sudo sh -c ${freePort}`.quiet().nothrow();
  try {
    Bun.serve({
      port: PORT,
      hostname: HOST,
      async fetch(req) {
        const { pathname } = new URL(req.url);

        // Try to serve the exact file from dist/ (e.g. /assets/foo.js, /favicon.ico)
        const filePath = DIST_DIR + (pathname === "/" ? "/index.html" : pathname);
        const file = Bun.file(filePath);
        if (await file.exists()) {
          return new Response(file);
        }

        // SPA fallback: serve index.html for client-side routes
        const fallback = Bun.file(FALLBACK_HTML);
        if (await fallback.exists()) {
          return new Response(fallback);
        }

        return new Response("Not Found", { status: 404 });
      },
    });
    break;
  } catch (err) {
    if (attempt >= 10) throw err;
    await Bun.sleep(200);
  }
}
console.log(`team-site serving SPA on http://${HOST}:${String(PORT)}`);
