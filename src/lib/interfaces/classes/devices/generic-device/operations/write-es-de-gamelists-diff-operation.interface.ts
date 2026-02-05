import type Gamelist from "../../../../../classes/entities/gamelist.class.js";
import type { ConsoleName } from "../../../../../types/consoles/console-name.type.js";

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
