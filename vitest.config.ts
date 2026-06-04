import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const aiSrcIndex = fileURLToPath(new URL("../fuzzy-ai/src/index.ts", import.meta.url));
const aiSrcOAuth = fileURLToPath(new URL("../fuzzy-ai/src/oauth.ts", import.meta.url));
const agentSrcIndex = fileURLToPath(new URL("../fuzzy-agent/src/index.ts", import.meta.url));

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		testTimeout: 30000,
		server: {
			deps: {
				external: [/@silvia-odwyer\/photon-node/],
			},
		},
	},
	resolve: {
		alias: [
			{ find: /^@fuzzyos\/fuzzy-ai$/, replacement: aiSrcIndex },
			{ find: /^@fuzzyos\/fuzzy-ai\/oauth$/, replacement: aiSrcOAuth },
			{ find: /^@fuzzyos\/fuzzy-agent$/, replacement: agentSrcIndex },
		],
	},
});
