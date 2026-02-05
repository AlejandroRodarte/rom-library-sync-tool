import {
  ES_DE_GAMELISTS,
  MEDIA,
  ROMS,
} from "./content-target-names.constants.js";

const ALL_CONTENT_TARGET_NAMES = [ROMS, MEDIA, ES_DE_GAMELISTS] as const;

export default ALL_CONTENT_TARGET_NAMES;
