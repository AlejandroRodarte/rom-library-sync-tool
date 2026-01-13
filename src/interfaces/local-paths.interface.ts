import type { ConsolePaths } from "../types/console-paths.types.js";

export interface LocalPaths {
  dirs: {
    fileIO: {
      base: string; // devices/local/
      logs: {
        base: string; // devices/local/logs/
      }
      lists: {
        base: string; // devices/local/lists/
        roms: string; // devices/local/lists/roms/
      };
      diffs: {
        base: string; // devices/local/diffs/
        roms: string; // devices/local/diffs/roms/
      };
      failed: {
        base: string; // devices/local/failed/
        roms: string; // devices/local/failed/roms/
      };
    };
    sync: {
      roms: {
        base: string; // $LOCAL_ROMS_DIR_PATH/
        consoles: ConsolePaths; // $LOCAL_ROMS_DIR_PATH/<console>/
      };
    };
  };
  files: {
    fileIO: {
      logs: {
        duplicates: string; // devices/local/logs/duplicates.log.txt
        scrapped: string; // devices/local/logs/scrapped.log.txt
      }
      lists: {
        roms: {
          consoles: ConsolePaths; // devices/local/lists/roms/<console>.list.txt
        };
      };
      diffs: {
        roms: {
          consoles: ConsolePaths; // devices/local/diffs/roms/<console>.diff.txt
        };
      };
      failed: {
        roms: {
          consoles: ConsolePaths; // devices/local/failed/roms/<console>.failed.txt
        };
      };
    };
  };
}
