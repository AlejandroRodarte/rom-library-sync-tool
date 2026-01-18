import type CustomError from "../classes/errors/custom-error.abstract.class.js";
import type { FileIOLsEntry } from "./file-io-ls-entry.interface.js";

export interface FileIO {
  ls: (
    dirPath: string,
  ) => Promise<[FileIOLsEntry[], undefined] | [undefined, CustomError]>;

  exists: (
    type: "file" | "dir" | "link",
    path: string,
    rights?: "r" | "w" | "rw",
  ) => Promise<CustomError | undefined>;
}
