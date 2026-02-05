import { FS, SFTP } from "./file-io-strategies.constants.js";

const ALL_FILE_IO_STRATEGIES = [FS, SFTP] as const;

export default ALL_FILE_IO_STRATEGIES;
