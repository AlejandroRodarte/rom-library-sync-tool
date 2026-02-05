import type { ContentTargetName } from "../../../../../types/content-targets/content-target-name.type.js";
import type { ContentTargetPaths } from "../../../../../types/content-targets/content-target-paths.type.js";

export interface GenericDeviceContentTargetsEnvData {
  names: ContentTargetName[];
  paths: ContentTargetPaths;
}
