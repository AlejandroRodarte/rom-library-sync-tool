import type Roms from "../../../../../classes/entities/roms.class.js";
import type { ConsoleName } from "../../../../../types/consoles/console-name.type.js";
import type { BasenameMediaEntries } from "../../../../../types/media/basename-media-entries.type.js";
import type { MediaName } from "../../../../../types/media/media-name.type.js";

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
