import type Gamelist from "../classes/gamelist.class.js";
import type { ConsoleName } from "../types/console-name.type.js";

export interface WriteEsDeGamelistsDiffOperation {
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
    gamelist: Gamelist;
  };
}
