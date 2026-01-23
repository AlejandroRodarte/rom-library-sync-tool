import type { ConsoleName } from "../types/console-name.type.js";

export interface WriteConsoleRomsListOperation {
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
  };
}
