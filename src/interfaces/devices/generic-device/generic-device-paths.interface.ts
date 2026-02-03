import type { ContentTargetName } from "../../../types/content-target-name.type.js";
import type { GenericDeviceContentTargetsDirPaths } from "./generic-device-content-targets-dir-paths.interface.js";
import type { GenericDeviceContentTargetsFilePaths } from "./generic-device-content-targets-file-paths.interface.js";
import type { GenericDeviceProjectDiffsDirPaths } from "./generic-device-project-diffs-dir-paths.interface.js";
import type { GenericDeviceProjectDiffsFilePaths } from "./generic-device-project-diffs-file-paths.interface.js";
import type { GenericDeviceProjectFailedDirPaths } from "./generic-device-project-failed-dir-paths.interface.js";
import type { GenericDeviceProjectFailedFilePaths } from "./generic-device-project-failed-file-paths.interface.js";
import type { GenericDeviceProjectListsDirPaths } from "./generic-device-project-lists-dir-paths.interface.js";
import type { GenericDeviceProjectListsFilePaths } from "./generic-device-project-lists-file-paths.interface.js";

export interface GenericDevicePaths {
  dirs: {
    project: {
      base: string; // devices/<device>/
      logs: {
        base: string; // devices/<device>/logs/
      };
      lists: {
        base: string; // devices/<device>/lists/
        "content-targets": {
          [T in ContentTargetName]: GenericDeviceProjectListsDirPaths[T];
        };
      };
      diffs: {
        base: string; // devices/<device>/diffs/
        "content-targets": {
          [T in ContentTargetName]: GenericDeviceProjectDiffsDirPaths[T];
        };
      };
      failed: {
        base: string; // devices/<device>/failed/
        "content-targets": {
          [T in ContentTargetName]: GenericDeviceProjectFailedDirPaths[T];
        };
      };
    };
    "content-targets": {
      [T in ContentTargetName]: GenericDeviceContentTargetsDirPaths[T];
    };
  };
  files: {
    project: {
      logs: {
        duplicates: string; // devices/<device>/logs/duplicates.log.txt
        scrapped: string; // devices/<device>/logs/scrapped.log.txt
      };
      lists: {
        [T in ContentTargetName]: GenericDeviceProjectListsFilePaths[T];
      };
      diffs: {
        [T in ContentTargetName]: GenericDeviceProjectDiffsFilePaths[T];
      };
      failed: {
        [T in ContentTargetName]: GenericDeviceProjectFailedFilePaths[T];
      };
    };
    "content-targets": {
      [T in Exclude<
        ContentTargetName,
        "roms" | "media"
      >]: GenericDeviceContentTargetsFilePaths[T];
    };
  };
}
