import type { MEDIA } from "../constants/content-target-names.constants.js";
import type { MediaName } from "../types/media-name.type.js";

export interface ConsoleContentTargetsEnvData {
  [MEDIA]: {
    names: MediaName[];
  };
}
