import FILE_IO_FS_CRUD_STRATEGIES from "../../../constants/file-io-fs-crud-strategies.constant.js";
import type { FileIOFsCrudStrategy } from "../../../types/file-io-fs-crud-strategy.type.js";

const isFileIOFsCrudStrategy = (
  s: string,
): s is FileIOFsCrudStrategy =>
  FILE_IO_FS_CRUD_STRATEGIES.includes(s as FileIOFsCrudStrategy);

export default isFileIOFsCrudStrategy;
