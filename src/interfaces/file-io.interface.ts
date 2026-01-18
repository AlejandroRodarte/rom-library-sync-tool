import type AppValidationError from "../classes/errors/app-validation-error.class.js";
import type FileIOBadCredentialsError from "../classes/errors/file-io-bad-credentials-error.class.js";
import type FileIOBadPathError from "../classes/errors/file-io-bad-path-error.class.js";
import type FileIOBadTypeError from "../classes/errors/file-io-bad-type-error.class.js";
import type FileIOConnectionError from "../classes/errors/file-io-connection-error.class.js";
import type FileIONotFoundError from "../classes/errors/file-io-not-found-error.class.js";
import type FileIOUnauthorizedError from "../classes/errors/file-io-unauthorized-error.class.js";
import type UnknownError from "../classes/errors/unknown-error.class.js";
import type { FileIOLsEntry } from "./file-io-ls-entry.interface.js";

export type FileIOLsMethodError =
  | UnknownError
  | FileIONotFoundError
  | FileIOBadTypeError
  | FileIOBadPathError
  | FileIOUnauthorizedError
  | FileIOConnectionError
  | FileIOBadCredentialsError
  | AppValidationError;

export type FileIOExistsMethodError =
  | UnknownError
  | FileIONotFoundError
  | FileIOBadTypeError
  | FileIOBadPathError
  | FileIOUnauthorizedError
  | FileIOConnectionError
  | FileIOBadCredentialsError
  | AppValidationError;

export interface FileIO {
  ls: (
    dirPath: string,
  ) => Promise<[FileIOLsEntry[], undefined] | [undefined, FileIOLsMethodError]>;

  exists: (
    type: "file" | "dir" | "link",
    path: string,
    rights?: "r" | "w" | "rw",
  ) => Promise<FileIOExistsMethodError | undefined>;
}
