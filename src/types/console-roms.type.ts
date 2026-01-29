import type { ConsoleContent } from "./console-content.type.js";
import type { ConsoleName } from "./console-name.type.js";
import type { Roms } from "./roms.type.js";

export type ConsoleRoms = Partial<
  ConsoleContent<{ name: ConsoleName; roms: { all: Roms; selected: Roms } }>
>;
