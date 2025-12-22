import CONSOLE_NAMES from "../constants/console-names.constant.js";
import type { Consoles, Console, Rom } from "../types.js";

const buildEmptyConsolesObject = (): Consoles => {
  const consoles: Consoles = new Map<string, Console>();

  for (const name of CONSOLE_NAMES)
    consoles.set(name, {
      roms: {
        selected: {
          none: new Map<string, Rom[]>(),
          one: new Map<string, Rom[]>(),
          multiple: new Map<string, Rom[]>(),
        },
      },
    });

  return consoles;
};

export default buildEmptyConsolesObject;
