import type { ExtensionAPI } from "@fuzzyos/fuzzy-code";

export default function widgetPlacementExtension(fuzzy: ExtensionAPI) {
	fuzzy.on("session_start", (_event, ctx) => {
		if (!ctx.hasUI) return;
		ctx.ui.setWidget("widget-above", ["Above editor widget"]);
		ctx.ui.setWidget("widget-below", ["Below editor widget"], { placement: "belowEditor" });
	});
}
