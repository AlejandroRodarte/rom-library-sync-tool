import type { ContentTargetName } from "../../../types/content-target-name.type.js";
import type { SteamDeckLCDAlejandroContentTargetsDirPaths } from "./steam-deck-lcd-alejandro-content-targets-dir-paths.interface.js";
import type { SteamDeckLCDAlejandroContentTargetsFilePaths } from "./steam-deck-lcd-alejandro-content-targets-file-paths.interface.js";
import type { SteamDeckLCDAlejandroProjectDiffsDirPaths } from "./steam-deck-lcd-alejandro-project-diffs-dir-paths.interface.js";
import type { SteamDeckLCDAlejandroProjectDiffsFilePaths } from "./steam-deck-lcd-alejandro-project-diffs-file-paths.interface.js";
import type { SteamDeckLCDAlejandroProjectFailedDirPaths } from "./steam-deck-lcd-alejandro-project-failed-dir-paths.interface.js";
import type { SteamDeckLCDAlejandroProjectFailedFilePaths } from "./steam-deck-lcd-alejandro-project-failed-file-paths.interface.js";
import type { SteamDeckLCDAlejandroProjectListsDirPaths } from "./steam-deck-lcd-alejandro-project-lists-dir-paths.interface.js";
import type { SteamDeckLCDAlejandroProjectListsFilePaths } from "./steam-deck-lcd-alejandro-project-lists-file-paths.interface.js";

export interface SteamDeckLCDAlejandroPaths {
  dirs: {
    project: {
      base: string; // devices/steam-deck-lcd-alejandro/
      logs: {
        base: string; // devices/steam-deck-lcd-alejandro/logs/
      };
      lists: {
        base: string; // devices/steam-deck-lcd-alejandro/lists/
        "content-targets": {
          [T in Exclude<
            ContentTargetName,
            "es-de-gamelists"
          >]: SteamDeckLCDAlejandroProjectListsDirPaths[T];
        };
      };
      diffs: {
        base: string; // devices/steam-deck-lcd-alejandro/diffs/
        "content-targets": {
          [T in Exclude<
            ContentTargetName,
            "es-de-gamelists"
          >]: SteamDeckLCDAlejandroProjectDiffsDirPaths[T];
        };
      };
      failed: {
        base: string; // devices/steam-deck-lcd-alejandro/failed/
        "content-targets": {
          [T in Exclude<
            ContentTargetName,
            "es-de-gamelists"
          >]: SteamDeckLCDAlejandroProjectFailedDirPaths[T];
        };
      };
    };
    "content-targets": {
      [T in ContentTargetName]: SteamDeckLCDAlejandroContentTargetsDirPaths[T];
    };
  };
  files: {
    project: {
      logs: {
        duplicates: string; // devices/steam-deck-lcd-alejandro/logs/duplicates.log.txt
        scrapped: string; // devices/steam-deck-lcd-alejandro/logs/scrapped.log.txt
      };
      lists: {
        [T in Exclude<
          ContentTargetName,
          "es-de-gamelists"
        >]: SteamDeckLCDAlejandroProjectListsFilePaths[T];
      };
      diffs: {
        [T in Exclude<
          ContentTargetName,
          "es-de-gamelists"
        >]: SteamDeckLCDAlejandroProjectDiffsFilePaths[T];
      };
      failed: {
        [T in Exclude<
          ContentTargetName,
          "es-de-gamelists"
        >]: SteamDeckLCDAlejandroProjectFailedFilePaths[T];
      };
    };
    "content-targets": {
      [T in Exclude<
        ContentTargetName,
        "roms" | "media"
      >]: SteamDeckLCDAlejandroContentTargetsFilePaths[T];
    };
  };
}
