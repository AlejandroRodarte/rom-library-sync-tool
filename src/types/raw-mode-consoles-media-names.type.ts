import type { ConsoleNameAllNoneOrRest } from "./console-name-all-none-or-rest.type.js";

export type RawModeConsolesMediaNames = {
  [T in ConsoleNameAllNoneOrRest]?: string | string[];
};
