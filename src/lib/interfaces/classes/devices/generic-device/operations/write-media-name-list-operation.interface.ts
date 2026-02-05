import type { ConsoleName } from "../../../../../types/consoles/console-name.type.js";
import type { MediaName } from "../../../../../types/media/media-name.type.js";

export interface WriteMediaNameListOperation {
  paths: {
    device: {
      dir: string;
    };
    project: {
      file: string;
    };
  };
  names: {
    console: ConsoleName;
    media: MediaName;
  };
}
