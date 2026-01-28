import type { BasenameMediaEntries } from "../types/basename-media-entries.type.js";
import type { ConsoleName } from "../types/console-name.type.js";
import type { MediaName } from "../types/media-name.type.js";
import type { RomSet } from "../types/rom-set.type.js";

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
      all: RomSet;
      selected: RomSet;
    };
  };
  media: {
    name: MediaName;
    basename: {
      entries: BasenameMediaEntries;
    };
  };
}
