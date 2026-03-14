import { appendFileSync } from "node:fs";
import { join } from "node:path";
import type { ExtensionAPI } from "@fuzzyos/fuzzy-code";

export default function (fuzzy: ExtensionAPI) {
	const logFile = join(process.cwd(), ".fuzzy", "provider-payload.log");

	fuzzy.on("before_provider_request", (event) => {
		appendFileSync(logFile, `${JSON.stringify(event.payload, null, 2)}\n\n`, "utf8");

		// Optional: replace the payload instead of only logging it.
		// return { ...event.payload, temperature: 0 };
	});
}
