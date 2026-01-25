import type { ConsoleContent } from "./console-content.type.js";
import type { ConsoleName } from "./console-name.type.js";
import type { RomSet } from "./rom-set.type.js";

export type ConsoleRoms = Partial<
  ConsoleContent<{ name: ConsoleName; roms: { all: RomSet; selected: RomSet } }>
>;
