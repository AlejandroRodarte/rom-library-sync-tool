import type { MediaName } from "./media-name.type.js";

export type MediaPaths = {
  [M in MediaName]: string;
};
