import type { ConsoleContent } from "../types/console-content.type.js";
import type { ConsolePaths } from "../types/console-paths.types.js";
import type { MediaContent } from "../types/media-content.type.js";
import type { MediaPaths } from "../types/media-paths.type.js";

export interface SteamDeckPaths {
  dirs: {
    fileIO: {
      base: string; // devices/steam-deck/
      logs: {
        base: string; // devices/steam-deck/logs/
      };
      lists: {
        base: string; // devices/steam-deck/lists/
        roms: string; // devices/steam-deck/lists/roms/
        media: {
          base: string; // devices/steam-deck/lists/media/
          names: MediaPaths; // devices/steam-deck/lists/media/<media-name>/
        };
      };
      diffs: {
        base: string; // devices/steam-deck/diffs/
        roms: string; // devices/steam-deck/diffs/roms/
        media: {
          base: string; // devices/steam-deck/diffs/media/
          names: MediaPaths; // devices/steam-deck/diffs/media/<media-name>/
        };
      };
      failed: {
        base: string; // devices/<steam-deck>/failed/
        roms: string; // devices/steam-deck/failed/roms/
        media: {
          base: string; // devices/steam-deck/failed/media/
          names: MediaPaths; // devices/steam-deck/failed/media/<media-name>/
        };
      };
    };
    sync: {
      roms: {
        base: string; // $STEAM_DECK_REMOTE_ROMS_DIR_PATH/
        consoles: ConsolePaths; // $STEAM_DECK_REMOTE_ROMS_DIR_PATH/<console>/
      };
      media: {
        base: string; // $STEAM_DECK_REMOTE_MEDIA_DIR_PATH/
        consoles: ConsoleContent<{ base: string; names: MediaPaths }>; // $STEAM_DECK_REMOTE_MEDIA_DIR_PATH/<console>/<media-name>/
      };
      metadata: {
        base: string; // $STEAM_DECK_REMOTE_METADATA_DIR_PATH/
        consoles: ConsolePaths; // $STEAM_DECK_REMOTE_METADATA_DIR_PATH/<console>/
      };
    };
  };
  files: {
    fileIO: {
      logs: {
        duplicates: string; // devices/steam-deck/logs/duplicates.log.txt
        scrapped: string; // devices/steam-deck/logs/scrapped.log.txt
      };
      lists: {
        roms: {
          consoles: ConsolePaths; // devices/steam-deck/lists/roms/<console>.list.txt
        };
        media: MediaContent<ConsolePaths>; // devices/steam-deck/lists/media/<media-name>/<console>.list.txt
      };
      diffs: {
        roms: {
          consoles: ConsolePaths; // devices/steam-deck/diffs/roms/<console>.diff.txt
        };
        media: MediaContent<ConsolePaths>; // devices/steam-deck/diffs/media/<media-name>/<console>.diff.txt
      };
      failed: {
        roms: {
          consoles: ConsolePaths; // devices/steam-deck/failed/roms/<console>.failed.txt
        };
        media: MediaContent<ConsolePaths>; // devices/steam-deck/failed/media/<media-name>/<console>.failed.txt
      };
    };
    sync: {
      metadata: {
        consoles: ConsolePaths; // $STEAM_DECK_REMOTE_METADATA_DIR_PATH/<console>/gamelist.xml
      };
    };
  };
}
