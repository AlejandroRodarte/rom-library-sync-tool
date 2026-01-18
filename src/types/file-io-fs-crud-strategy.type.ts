import type FILE_IO_FS_CRUD_STRATEGIES from "../constants/file-io-fs-crud-strategies.constant.js";

export type FileIOFsCrudStrategy =
  (typeof FILE_IO_FS_CRUD_STRATEGIES)[number];
