import type { AllOrNone } from "./all-or-none.type.js";
import type { ConsoleName } from "./console-name.type.js";

export type ConsoleNameAllNoneOrRest = ConsoleName | AllOrNone | "rest";
