import CONSOLE_NAMES from "../constants/console-names.constant.js";
import type { Consoles } from "../types.js";

const buildEmptyConsolesObject = (): Consoles => {
  const consoles: Consoles = {};

  for (const name of CONSOLE_NAMES) {
    consoles[name] = {
      roms: {
        selected: {
          none: {},
          one: {},
          multiple: {},
        },
      },
    };
  }

  return consoles;
};

export default buildEmptyConsolesObject;
