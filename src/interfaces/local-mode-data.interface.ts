import type { ConsoleName } from "../types/console-name.type.js";
import type { ModeName } from "../types/mode-name.type.js";

export type LocalModeData<M extends ModeName> = M extends "list" | "diff"
  ? { consoles: ConsoleName[] }
  : { simulate: boolean; consoles: ConsoleName[] };
