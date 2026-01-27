import type { ContentTargetName } from "../../../types/content-target-name.type.js";
import type { AlejandroG751JTContentTargetsDirPaths } from "./alejandro-g751jt-content-targets-dir-paths.interface.js";
import type { AlejandroG751JTContentTargetsFilePaths } from "./alejandro-g751jt-content-targets-file-paths.interface.js";
import type { AlejandroG751JTProjectDiffsDirPaths } from "./alejandro-g751jt-project-diffs-dir-paths.interface.js";
import type { AlejandroG751JTProjectDiffsFilePaths } from "./alejandro-g751jt-project-diffs-file-paths.interface.js";
import type { AlejandroG751JTProjectFailedDirPaths } from "./alejandro-g751jt-project-failed-dir-paths.interface.js";
import type { AlejandroG751JTProjectFailedFilePaths } from "./alejandro-g751jt-project-failed-file-paths.interface.js";
import type { AlejandroG751JTProjectListsDirPaths } from "./alejandro-g751jt-project-lists-dir-paths.interface.js";
import type { AlejandroG751JTProjectListsFilePaths } from "./alejandro-g751jt-project-lists-file-paths.interface.js";

export interface AlejandroG751JTPaths {
  dirs: {
    project: {
      base: string; // devices/alejandro-g751jt/
      logs: {
        base: string; // devices/alejandro-g751jt/logs/
      };
      lists: {
        base: string; // devices/alejandro-g751jt/lists/
        "content-targets": {
          [T in ContentTargetName]: AlejandroG751JTProjectListsDirPaths[T];
        };
      };
      diffs: {
        base: string; // devices/alejandro-g751jt/diffs/
        "content-targets": {
          [T in ContentTargetName]: AlejandroG751JTProjectDiffsDirPaths[T];
        };
      };
      failed: {
        base: string; // devices/alejandro-g751jt/failed/
        "content-targets": {
          [T in ContentTargetName]: AlejandroG751JTProjectFailedDirPaths[T];
        };
      };
    };
    "content-targets": {
      [T in ContentTargetName]: AlejandroG751JTContentTargetsDirPaths[T];
    };
  };
  files: {
    project: {
      logs: {
        duplicates: string; // devices/alejandro-g751jt/logs/duplicates.log.txt
        scrapped: string; // devices/alejandro-g751jt/logs/scrapped.log.txt
      };
      lists: {
        [T in ContentTargetName]: AlejandroG751JTProjectListsFilePaths[T];
      };
      diffs: {
        [T in ContentTargetName]: AlejandroG751JTProjectDiffsFilePaths[T];
      };
      failed: {
        [T in ContentTargetName]: AlejandroG751JTProjectFailedFilePaths[T];
      };
    };
    "content-targets": {
      [T in Exclude<
        ContentTargetName,
        "roms" | "media"
      >]: AlejandroG751JTContentTargetsFilePaths[T];
    };
  };
}
