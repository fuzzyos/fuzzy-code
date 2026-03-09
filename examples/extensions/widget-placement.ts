import type { ExtensionAPI, ExtensionContext } from "@fuzzyos/fuzzy-code";

const applyWidgets = (ctx: ExtensionContext) => {
	if (!ctx.hasUI) return;
	ctx.ui.setWidget("widget-above", ["Above editor widget"]);
	ctx.ui.setWidget("widget-below", ["Below editor widget"], { placement: "belowEditor" });
};

export default function widgetPlacementExtension(fuzzy: ExtensionAPI) {
	fuzzy.on("session_start", (_event, ctx) => {
		applyWidgets(ctx);
	});

	fuzzy.on("session_switch", (_event, ctx) => {
		applyWidgets(ctx);
	});
}
