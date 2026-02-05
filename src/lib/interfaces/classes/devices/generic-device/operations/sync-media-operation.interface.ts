import type { ConsoleName } from "../../../../../types/consoles/console-name.type.js";
import type { MediaName } from "../../../../../types/media/media-name.type.js";

export interface SyncMediaOperation {
  paths: {
    project: {
      diff: {
        file: string;
      };
      failed: {
        file: string;
      };
    };
    device: {
      dir: string;
    };
    db: {
      dir: string;
    };
  };
  console: {
    name: ConsoleName;
  };
  media: {
    name: MediaName;
  };
}
