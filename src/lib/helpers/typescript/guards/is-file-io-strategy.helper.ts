import ALL_FILE_IO_STRATEGIES from "../../../constants/file-io/all-file-io-strategies.constant.js";
import type { FileIOStrategy } from "../../../types/file-io/file-io-strategy.type.js";

const isFileIOStrategy = (s: string): s is FileIOStrategy =>
  ALL_FILE_IO_STRATEGIES.includes(s as FileIOStrategy);

export default isFileIOStrategy;
