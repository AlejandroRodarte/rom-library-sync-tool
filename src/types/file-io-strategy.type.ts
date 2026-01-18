import type FILE_IO_STRATEGIES from "../constants/file-io-strategies.constant.js";

export type FileIOStrategy = (typeof FILE_IO_STRATEGIES)[number];
