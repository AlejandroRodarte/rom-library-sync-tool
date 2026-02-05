import type { ES_DE_GAMELISTS } from "../../constants/content-targets/content-target-names.constants.js";
import type { ConsolePaths } from "../../types/consoles/console-paths.types.js";

export interface DatabaseFilePaths {
  [ES_DE_GAMELISTS]: {
    consoles: ConsolePaths;
  };
}
