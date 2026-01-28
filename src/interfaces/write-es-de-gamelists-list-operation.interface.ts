import type { ConsoleName } from "../types/console-name.type.js";

export interface WriteEsDeGamelistsListOperation {
  paths: {
    device: {
      file: string;
    };
    project: {
      file: string;
    };
  };
  names: {
    console: ConsoleName;
  };
}
