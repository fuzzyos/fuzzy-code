#!/usr/bin/env node
/**
 * CLI entry point for the refactored code.
 * Uses main.ts with AgentSession and new mode modules.
 *
 * Test with: npx tsx src/cli-new.ts [args...]
 */
process.title = "fuzzy";

import { setBedrockProviderModule } from "@fuzzyos/fuzzy-ai";
import { bedrockProviderModule } from "@fuzzyos/fuzzy-ai/bedrock-provider";
import { EnvHttpProxyAgent, setGlobalDispatcher } from "undici";
import { main } from "./main.js";

setGlobalDispatcher(new EnvHttpProxyAgent());
setBedrockProviderModule(bedrockProviderModule);

main(process.argv.slice(2));
