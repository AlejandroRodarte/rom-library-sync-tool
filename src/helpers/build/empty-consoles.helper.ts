import CONSOLE_NAMES from "../../constants/console-names.constant.js";
import type { Consoles, Console, Titles } from "../../types.js";

const emptyConsoles = (): Consoles => {
  const consoles: Consoles = new Map<string, Console>();
  for (const name of CONSOLE_NAMES)
    consoles.set(name, new Map<number, Titles>());
  return consoles;
};

export default emptyConsoles;
