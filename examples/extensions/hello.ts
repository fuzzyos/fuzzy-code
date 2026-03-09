/**
 * Hello Tool - Minimal custom tool example
 */

import { Type } from "@fuzzyos/fuzzy-ai";
import type { ExtensionAPI } from "@fuzzyos/fuzzy-code";

export default function (fuzzy: ExtensionAPI) {
	fuzzy.registerTool({
		name: "hello",
		label: "Hello",
		description: "A simple greeting tool",
		parameters: Type.Object({
			name: Type.String({ description: "Name to greet" }),
		}),

		async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
			const { name } = params as { name: string };
			return {
				content: [{ type: "text", text: `Hello, ${name}!` }],
				details: { greeted: name },
			};
		},
	});
}
