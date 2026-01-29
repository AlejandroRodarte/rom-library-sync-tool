import type Roms from "../classes/roms.class.js";
import type { BasenameMediaEntries } from "../types/basename-media-entries.type.js";
import type { ConsoleName } from "../types/console-name.type.js";
import type { MediaName } from "../types/media-name.type.js";

export interface WriteMediaNameDiffOperation {
  paths: {
    project: {
      list: {
        file: string;
      };
      diff: {
        file: string;
      };
    };
  };
  console: {
    name: ConsoleName;
    roms: {
      all: Roms;
      selected: Roms;
    };
  };
  media: {
    name: MediaName;
    entries: BasenameMediaEntries;
  };
}
