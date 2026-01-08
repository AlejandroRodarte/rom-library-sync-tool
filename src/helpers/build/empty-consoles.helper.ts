import Console from "../../classes/console.class.js";
import CONSOLE_NAMES from "../../constants/console-names.constant.js";
import type { Consoles } from "../../types.js";

const emptyConsoles = (): Consoles => {
  const consoles: Consoles = new Map<string, Console>();
  for (const name of CONSOLE_NAMES) consoles.set(name, new Console(name));
  return consoles;
};

export default emptyConsoles;
