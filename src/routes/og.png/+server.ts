import { ImageResponse } from '@vercel/og';
import type { RequestHandler } from './$types.ts';

// @vercel/og v0.6+ runs on Node runtime as well as Edge. Node 22 is what the
// rest of the app uses, so we keep the runtime consistent and avoid the
// adapter-vercel `runtime: 'edge'` deprecation warning.
export const config = { runtime: 'nodejs22.x' };

export const prerender = false;

const TITLE = 'Is this dodgy?';
const SUBTITLE = 'Paste a link, email, phone number or message. Get a calm answer.';

export const GET: RequestHandler = () => {
	return new ImageResponse(
		{
			type: 'div',
			props: {
				style: {
					height: '100%',
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					padding: '80px',
					background: '#0b132b',
					color: '#f4f1e8',
					fontFamily: 'Geist'
				},
				children: [
					{
						type: 'div',
						props: {
							style: { display: 'flex', alignItems: 'center', gap: '20px' },
							children: [
								{
									type: 'div',
									props: {
										style: {
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											width: '64px',
											height: '64px',
											borderRadius: '14px',
											background: '#f6c453',
											color: '#0b132b',
											fontSize: '40px',
											fontWeight: 700
										},
										children: '?'
									}
								},
								{
									type: 'div',
									props: {
										style: { fontSize: '32px', fontWeight: 600, letterSpacing: '-0.01em' },
										children: 'isthisdodgy.co.uk'
									}
								}
							]
						}
					},
					{
						type: 'div',
						props: {
							style: { display: 'flex', flexDirection: 'column', gap: '24px' },
							children: [
								{
									type: 'div',
									props: {
										style: {
											fontSize: '120px',
											fontWeight: 600,
											letterSpacing: '-0.04em',
											lineHeight: 1,
											color: '#f6c453'
										},
										children: TITLE
									}
								},
								{
									type: 'div',
									props: {
										style: {
											fontSize: '36px',
											color: '#d3cdbc',
											letterSpacing: '-0.01em',
											maxWidth: '880px',
											lineHeight: 1.25
										},
										children: SUBTITLE
									}
								}
							]
						}
					},
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								gap: '16px',
								fontSize: '24px',
								color: '#9a9684'
							},
							children: [
								{ type: 'span', props: { children: 'Free' } },
								{ type: 'span', props: { children: '·' } },
								{ type: 'span', props: { children: 'No signup' } },
								{ type: 'span', props: { children: '·' } },
								{ type: 'span', props: { children: 'No ads' } },
								{ type: 'span', props: { children: '·' } },
								{ type: 'span', props: { children: 'UK' } }
							]
						}
					}
				]
			}
		},
		{
			width: 1200,
			height: 630,
			headers: {
				// Vercel's framework default is `no-cache, no-store` which would
				// stomp our s-maxage. CDN-Cache-Control and Vercel-CDN-Cache-Control
				// are honoured independently and override the default at the edge.
				'Cache-Control': 'public, max-age=300',
				'CDN-Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
				'Vercel-CDN-Cache-Control': 'public, s-maxage=31536000, immutable',
				'Content-Type': 'image/png'
			}
		}
	);
};
