import { DIR, FILE, LINK } from "./fs-types.constants.js";

const ALL_FS_TYPES = [FILE, DIR, LINK] as const;

export default ALL_FS_TYPES;
