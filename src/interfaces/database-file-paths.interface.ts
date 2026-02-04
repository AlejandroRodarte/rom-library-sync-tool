import type { ES_DE_GAMELISTS } from "../constants/content-target-names.constants.js";
import type { ConsolePaths } from "../types/console-paths.types.js";

export interface DatabaseFilePaths {
  [ES_DE_GAMELISTS]: {
    consoles: ConsolePaths;
  };
}
