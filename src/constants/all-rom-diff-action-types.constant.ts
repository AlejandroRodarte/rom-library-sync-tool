import { ADD_ROM, DELETE_ROM } from "./rom-diff-action-types.constants.js";

const ALL_ROM_DIFF_ACTION_TYPES = [ADD_ROM, DELETE_ROM] as const;

export default ALL_ROM_DIFF_ACTION_TYPES;
