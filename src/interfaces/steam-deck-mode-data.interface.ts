import type { ConsoleName } from "../types/console-name.type.js";
import type { MediaName } from "../types/media-name.type.js";
import type { ModeName } from "../types/mode-name.type.js";

export type SteamDeckModeData<M extends ModeName> = M extends "list" | "diff"
  ? { consoles: ConsoleName[]; medias: MediaName[] }
  : { simulate: boolean; consoles: ConsoleName[]; medias: MediaName[] };
