import type { ConsoleName } from "../../../../../types/consoles/console-name.type.js";

export interface SyncRomsOperation {
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
}
