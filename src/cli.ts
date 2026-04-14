#!/usr/bin/env node
/**
 * CLI entry point for the refactored code.
 * Uses main.ts with AgentSession and new mode modules.
 *
 * Test with: npx tsx src/cli-new.ts [args...]
 */
process.title = "fuzzy";
process.env.FUZZY_CODE = "true";
process.emitWarning = (() => {}) as typeof process.emitWarning;

import { EnvHttpProxyAgent, setGlobalDispatcher } from "undici";
import { main } from "./main.js";

setGlobalDispatcher(new EnvHttpProxyAgent());

main(process.argv.slice(2));
