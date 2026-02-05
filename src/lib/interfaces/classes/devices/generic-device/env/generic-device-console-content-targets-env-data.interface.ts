import type { MEDIA } from "../../../../../constants/content-targets/content-target-names.constants.js";
import type { MediaName } from "../../../../../types/media/media-name.type.js";

export interface GenericDeviceConsoleContentTargetsEnvData {
  [MEDIA]: {
    names: MediaName[];
  };
}
