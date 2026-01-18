import FILE_IO_STRATEGIES from "../../../constants/file-io-strategies.constant.js";
import type { FileIOStrategy } from "../../../types/file-io-strategy.type.js";

const isFileIOStrategy = (s: string): s is FileIOStrategy =>
  FILE_IO_STRATEGIES.includes(s as FileIOStrategy);

export default isFileIOStrategy;
