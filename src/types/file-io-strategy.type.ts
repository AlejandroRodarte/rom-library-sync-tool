import type ALL_FILE_IO_STRATEGIES from "../constants/all-file-io-strategies.constant.js";

export type FileIOStrategy = (typeof ALL_FILE_IO_STRATEGIES)[number];
