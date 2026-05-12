// Lightweight in-memory rate limiter. It is per serverless instance, not global,
// so it won't stop a distributed flood, but it cheaply blocks the realistic
// abuse case: one client hammering the API and burning our external-API budget.
// If you later need a global limit, swap the Map for Upstash / Vercel KV behind
// the same `checkRateLimit` signature.
//
// Fixed window: each key gets up to MAX_HITS requests per WINDOW_MS, then has to
// wait for the window to roll over.

const WINDOW_MS = 60_000;
const MAX_HITS = (() => {
	const n = Number.parseInt(process.env.RATE_LIMIT_PER_MINUTE ?? '', 10);
	return Number.isFinite(n) && n > 0 ? n : 30;
})();

// Cap the number of tracked keys so a flood of unique IPs can't grow the Map
// without bound. When full we fail open (allow) rather than evict, which would
// just let an attacker churn entries.
const MAX_TRACKED = 5_000;

type Bucket = { hits: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export type RateVerdict = { ok: true } | { ok: false; retryAfterSeconds: number };

export function checkRateLimit(key: string, now: number = Date.now()): RateVerdict {
	const existing = buckets.get(key);

	if (!existing || existing.resetAt <= now) {
		if (!existing && buckets.size >= MAX_TRACKED) {
			// Opportunistically drop expired entries before deciding to fail open.
			for (const [k, b] of buckets) {
				if (b.resetAt <= now) buckets.delete(k);
			}
			if (buckets.size >= MAX_TRACKED) return { ok: true };
		}
		buckets.set(key, { hits: 1, resetAt: now + WINDOW_MS });
		return { ok: true };
	}

	if (existing.hits >= MAX_HITS) {
		return {
			ok: false,
			retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000))
		};
	}

	existing.hits += 1;
	return { ok: true };
}

// Exposed for tests.
export function _resetRateLimit(): void {
	buckets.clear();
}
