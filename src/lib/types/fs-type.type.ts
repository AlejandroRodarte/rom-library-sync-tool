import type ALL_FS_TYPES from "../constants/fs/all-fs-types.constant.js";

export type FsType = (typeof ALL_FS_TYPES)[number];
