import type { ConsoleName } from "./console-name.type.js";

export type ConsolePaths = {
  [C in ConsoleName]: string;
};
