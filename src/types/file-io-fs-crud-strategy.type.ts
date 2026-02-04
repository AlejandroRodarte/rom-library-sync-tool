import type ALL_FILE_IO_FS_CRUD_STRATEGIES from "../constants/all-file-io-fs-crud-strategies.constant.js";

export type FileIOFsCrudStrategy =
  (typeof ALL_FILE_IO_FS_CRUD_STRATEGIES)[number];
