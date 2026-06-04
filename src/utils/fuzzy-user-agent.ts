export function getFuzzyUserAgent(version: string): string {
	const runtime = process.versions.bun ? `bun/${process.versions.bun}` : `node/${process.version}`;
	return `fuzzy/${version} (${process.platform}; ${runtime}; ${process.arch})`;
}
