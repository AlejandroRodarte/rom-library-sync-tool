import type { ConsoleName } from "./console-name.type.js";

export type ConsoleContent<ContentType> = {
  [C in ConsoleName]: ContentType;
};
