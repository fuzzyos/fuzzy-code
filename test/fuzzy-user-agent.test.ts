import { describe, expect, it } from "vitest";
import { getFuzzyUserAgent } from "../src/utils/fuzzy-user-agent.ts";

describe("getFuzzyUserAgent", () => {
	it("formats the user agent expected by fuzzyos.com", () => {
		const runtime = process.versions.bun ? `bun/${process.versions.bun}` : `node/${process.version}`;
		const userAgent = getFuzzyUserAgent("1.2.3");

		expect(userAgent).toBe(`fuzzy/1.2.3 (${process.platform}; ${runtime}; ${process.arch})`);
		expect(userAgent).toMatch(/^fuzzy\/[^\s()]+ \([^;()]+;\s*[^;()]+;\s*[^()]+\)$/);
	});
});
