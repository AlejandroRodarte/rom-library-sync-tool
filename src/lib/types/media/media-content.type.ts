import type { MediaName } from "./media-name.type.js";

export type MediaContent<ContentType> = {
  [M in MediaName]: ContentType;
};
