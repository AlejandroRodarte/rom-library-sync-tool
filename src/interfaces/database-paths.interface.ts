import type {
  MEDIA,
  ROMS,
} from "../constants/content-target-names.constants.js";
import type { ContentTargetName } from "../types/content-target-name.type.js";
import type { DatabaseDirPaths } from "./database-dir-paths.interface.js";
import type { DatabaseFilePaths } from "./database-file-paths.interface.js";

export interface DatabasePaths {
  dirs: {
    [C in ContentTargetName]: DatabaseDirPaths[C];
  };
  files: {
    [C in Exclude<
      ContentTargetName,
      typeof ROMS | typeof MEDIA
    >]: DatabaseFilePaths[C];
  };
}
