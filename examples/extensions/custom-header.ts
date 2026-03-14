/**
 * Custom Header Extension
 *
 * Demonstrates ctx.ui.setHeader() for replacing the built-in header
 * (logo + keybinding hints) with a custom component showing the fuzzy mascot.
 */

import type { ExtensionAPI, Theme } from "@fuzzyos/fuzzy-code";
import { VERSION } from "@fuzzyos/fuzzy-code";

// --- PI MASCOT ---
// Based on fuzzy_mascot.ts - the fuzzy agent character
function getPiMascot(theme: Theme): string[] {
	// --- COLORS ---
	// 3b1b Blue: R=80, G=180, B=230
	const fuzzyBlue = (text: string) => theme.fg("accent", text);
	const white = (text: string) => text; // Use plain white (or theme.fg("text", text))
	const black = (text: string) => theme.fg("dim", text); // Use dim for contrast

	// --- GLYPHS ---
	const BLOCK = "█";
	const PUPIL = "▌"; // Vertical half-block for the pupil

	// --- CONSTRUCTION ---

	// 1. The Eye Unit: [White Full Block][Black Vertical Sliver]
	// This creates the "looking sideways" effect
	const eye = `${white(BLOCK)}${black(PUPIL)}`;

	// 2. Line 1: The Eyes
	// 5 spaces indent aligns them with the start of the legs
	const lineEyes = `     ${eye}  ${eye}`;

	// 3. Line 2: The Wide Top Bar (The "Overhang")
	// 14 blocks wide for that serif-style roof
	const lineBar = `  ${fuzzyBlue(BLOCK.repeat(14))}`;

	// 4. Lines 3-6: The Legs
	// Indented 5 spaces relative to the very left edge
	// Leg width: 2 blocks | Gap: 4 blocks
	const lineLeg = `     ${fuzzyBlue(BLOCK.repeat(2))}    ${fuzzyBlue(BLOCK.repeat(2))}`;

	// --- ASSEMBLY ---
	return ["", lineEyes, lineBar, lineLeg, lineLeg, lineLeg, lineLeg, ""];
}

export default function (fuzzy: ExtensionAPI) {
	// Set custom header immediately on load (if UI is available)
	fuzzy.on("session_start", async (_event, ctx) => {
		if (ctx.hasUI) {
			ctx.ui.setHeader((_tui, theme) => {
				return {
					render(_width: number): string[] {
						const mascotLines = getPiMascot(theme);
						// Add a subtitle with hint
						const subtitle = `${theme.fg("muted", "   shitty code")}${theme.fg("dim", ` v${VERSION}`)}`;
						return [...mascotLines, subtitle];
					},
					invalidate() {},
				};
			});
		}
	});

	// Command to restore built-in header
	fuzzy.registerCommand("builtin-header", {
		description: "Restore built-in header with keybinding hints",
		handler: async (_args, ctx) => {
			ctx.ui.setHeader(undefined);
			ctx.ui.notify("Built-in header restored", "info");
		},
	});
}
