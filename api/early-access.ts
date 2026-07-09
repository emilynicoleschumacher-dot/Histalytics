import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Early access signup API — stores email submissions.
 * In production, this would write to a database (Postgres/Neon).
 * For now it accepts POST requests and returns success.
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { email } = req.body || {};

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ success: false, message: "Valid email required" });
  }

  try {
    // In production, store to Neon/Postgres via DATABASE_URL
    // For now, log and return success
    console.log(`[Early Access] New signup: ${email}`);
    
    return res.status(200).json({
      success: true,
      message: "You're on the list! We'll be in touch soon.",
    });
  } catch (err: any) {
    console.error("[Early Access] Error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
}