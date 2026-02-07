import {
  ES_DE_GAMELIST_NAME,
  ROM_FILENAME,
} from "./rom-title-name-build-strategies.constants.js";

const ALL_ROM_TITLE_NAME_BUILD_STRATEGIES = [
  ROM_FILENAME,
  ES_DE_GAMELIST_NAME,
] as const;

export default ALL_ROM_TITLE_NAME_BUILD_STRATEGIES;
