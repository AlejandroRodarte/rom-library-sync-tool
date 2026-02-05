import type { ConsoleName } from "../../../../../types/consoles/console-name.type.js";

export interface SyncEsDeGamelistsOperation {
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
      file: string;
    };
  };
  console: {
    name: ConsoleName;
  };
}
