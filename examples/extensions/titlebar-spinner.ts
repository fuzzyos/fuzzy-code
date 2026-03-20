/**
 * Titlebar Spinner Extension
 *
 * Shows a braille spinner animation in the terminal title while the agent is working.
 * Uses `ctx.ui.setTitle()` to update the terminal title via the extension API.
 *
 * Usage:
 *   fuzzy --extension examples/extensions/titlebar-spinner.ts
 */

import path from "node:path";
import type { ExtensionAPI, ExtensionContext } from "@fuzzyos/fuzzy-code";

const BRAILLE_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

function getBaseTitle(fuzzy: ExtensionAPI): string {
	const cwd = path.basename(process.cwd());
	const session = fuzzy.getSessionName();
	return session ? `fuzzy - ${session} - ${cwd}` : `fuzzy - ${cwd}`;
}

export default function (fuzzy: ExtensionAPI) {
	let timer: ReturnType<typeof setInterval> | null = null;
	let frameIndex = 0;

	function stopAnimation(ctx: ExtensionContext) {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
		frameIndex = 0;
		ctx.ui.setTitle(getBaseTitle(fuzzy));
	}

	function startAnimation(ctx: ExtensionContext) {
		stopAnimation(ctx);
		timer = setInterval(() => {
			const frame = BRAILLE_FRAMES[frameIndex % BRAILLE_FRAMES.length];
			const cwd = path.basename(process.cwd());
			const session = fuzzy.getSessionName();
			const title = session ? `${frame} fuzzy - ${session} - ${cwd}` : `${frame} fuzzy - ${cwd}`;
			ctx.ui.setTitle(title);
			frameIndex++;
		}, 80);
	}

	fuzzy.on("agent_start", async (_event, ctx) => {
		startAnimation(ctx);
	});

	fuzzy.on("agent_end", async (_event, ctx) => {
		stopAnimation(ctx);
	});

	fuzzy.on("session_shutdown", async (_event, ctx) => {
		stopAnimation(ctx);
	});
}
