import type { ModeName } from "./mode-name.type.js";

export type ModeContent<ContentType> = {
  [M in ModeName]: ContentType;
};
