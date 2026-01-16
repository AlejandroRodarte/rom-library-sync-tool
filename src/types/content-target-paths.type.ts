import type { ContentTargetName } from "./content-target-name.type.js";

export type ContentTargetPaths = {
  [C in ContentTargetName]: string;
};
