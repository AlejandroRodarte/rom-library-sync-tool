import type { DIR, FILE } from "../constants/fs/fs-types.constants.js";

export type FileOrDir = typeof FILE | typeof DIR;
