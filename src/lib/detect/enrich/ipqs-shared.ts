// Lightweight circuit breaker shared across the three IPQS enrichers. When
// IPQS replies with success: false (quota exhausted, key invalid, abuse
// throttling) we stop calling that endpoint for an hour so we don't burn
// further requests against an upstream that won't answer. State is
// module-level, so it lives only as long as the warm serverless container.
const COOLDOWN_MS = 60 * 60 * 1000;

const lastFailureAt: Record<string, number> = {
	url: 0,
	email: 0,
	phone: 0
};

export type IpqsEndpoint = 'url' | 'email' | 'phone';

export function ipqsCircuitOpen(endpoint: IpqsEndpoint): boolean {
	return Date.now() - lastFailureAt[endpoint] < COOLDOWN_MS;
}

export function ipqsNoteFailure(endpoint: IpqsEndpoint): void {
	lastFailureAt[endpoint] = Date.now();
}
