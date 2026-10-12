import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "./cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

export const DAILY_LIMIT = 15;

export class QuotaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QuotaError";
  }
}

function getAdminClient() {
  if (!SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not available to this function.");
  }
  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });
}

async function consumeQuota(userId: string, feature: string) {
  const admin = getAdminClient();

  const limit = DAILY_LIMIT;

  const { data, error } = await admin.rpc("consume_ai_quota", {
    p_user_id: userId,
    p_feature: feature,
    p_limit: limit,
  });
  if (error) throw new Error(`Quota check failed: ${error.message}`);

  const row = Array.isArray(data) ? data[0] : data;
  if (!row?.allowed) {
    throw new QuotaError(
      `You've used all ${limit} free AI requests for today. They reset at midnight IST.`
    );
  }
}

async function refundQuota(userId: string, feature: string) {
  try {
    const { error } = await getAdminClient().rpc("refund_ai_quota", { p_user_id: userId, p_feature: feature });
    if (error) console.error("Quota refund failed:", error.message);
  } catch (e) {
    console.error("Quota refund failed:", e);
  }
}

export async function runWithQuota<T>(userId: string, feature: string, fn: () => Promise<T>): Promise<T> {
  await consumeQuota(userId, feature);
  try {
    return await fn();
  } catch (err) {
    await refundQuota(userId, feature);
    throw err;
  }
}

export function errorResponse(err: unknown): Response {
  const status = err instanceof QuotaError ? 429 : 500;
  const message = err instanceof Error ? err.message : "Unexpected error";
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
