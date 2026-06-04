/**
 * Bash Spawn Hook Example
 *
 * Adjusts command, cwd, and env before execution.
 *
 * Usage:
 *   fuzzy -e ./bash-spawn-hook.ts
 */

import type { ExtensionAPI } from "@fuzzyos/fuzzy-code";
import { createBashTool } from "@fuzzyos/fuzzy-code";

export default function (fuzzy: ExtensionAPI) {
	const cwd = process.cwd();

	const bashTool = createBashTool(cwd, {
		spawnHook: ({ command, cwd, env }) => ({
			command: `source ~/.profile\n${command}`,
			cwd,
			env: { ...env, FUZZY_SPAWN_HOOK: "1" },
		}),
	});

	fuzzy.registerTool({
		...bashTool,
		execute: async (id, params, signal, onUpdate, _ctx) => {
			return bashTool.execute(id, params, signal, onUpdate);
		},
	});
}
