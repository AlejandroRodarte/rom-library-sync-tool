import type { ContentTargetName } from "../types/content-target-name.type.js";
import type { ContentTargetPaths } from "../types/content-target-paths.type.js";

export interface DeviceContentTargetsEnvData {
  names: ContentTargetName[];
  paths: ContentTargetPaths;
}
