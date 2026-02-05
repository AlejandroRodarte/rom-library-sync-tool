import {
  DIFF,
  DIFF_SYNC,
  DIFF_SYNC_LIST,
  LIST,
  LIST_DIFF_SYNC_LIST,
  SYNC,
  SYNC_LIST,
} from "./mode-names.constants.js";

const ALL_MODE_NAMES = [
  LIST,
  DIFF,
  SYNC,
  DIFF_SYNC,
  SYNC_LIST,
  DIFF_SYNC_LIST,
  LIST_DIFF_SYNC_LIST,
] as const;

export default ALL_MODE_NAMES;
