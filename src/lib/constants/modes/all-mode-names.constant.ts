import {
  DIFF,
  DIFF_SYNC,
  LIST,
  LIST_DIFF,
  LIST_DIFF_SYNC,
  SYNC,
} from "./mode-names.constants.js";

const ALL_MODE_NAMES = [
  LIST,
  DIFF,
  SYNC,
  LIST_DIFF,
  DIFF_SYNC,
  LIST_DIFF_SYNC,
] as const;

export default ALL_MODE_NAMES;
