import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// Inject the build date at compile time so the sitemap's lastmod tracks
// real deploys instead of staying frozen on a hardcoded literal.
const BUILD_DATE = new Date().toISOString().slice(0, 10);

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		__BUILD_DATE__: JSON.stringify(BUILD_DATE)
	}
});
