import Console from "../../classes/console.class.js";
import type { ConsoleName } from "../../types/console-name.type.js";
import type { Consoles } from "../../types/consoles.type.js";

const emptyConsoles = (consoleNames: ConsoleName[]): Consoles => {
  const consoles: Consoles = new Map<ConsoleName, Console>();
  for (const name of consoleNames) consoles.set(name, new Console(name));
  return consoles;
};

export default emptyConsoles;
