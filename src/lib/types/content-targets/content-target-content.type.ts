import type { ContentTargetName } from "./content-target-name.type.js";

export type ContentTargetContent<ContentType> = {
  [S in ContentTargetName]: ContentType;
}
