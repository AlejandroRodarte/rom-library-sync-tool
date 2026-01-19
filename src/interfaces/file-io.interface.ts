import type AppValidationError from "../classes/errors/app-validation-error.class.js";
import type FileIOBadCredentialsError from "../classes/errors/file-io-bad-credentials-error.class.js";
import type FileIOBadPathError from "../classes/errors/file-io-bad-path-error.class.js";
import type FileIOBadTypeError from "../classes/errors/file-io-bad-type-error.class.js";
import type FileIOCircularReferenceError from "../classes/errors/file-io-circular-reference-error.class.js";
import type FileIOConnectionError from "../classes/errors/file-io-connection-error.class.js";
import type FileIOExistsError from "../classes/errors/file-io-exists-error.class.js";
import type FileIOLockedError from "../classes/errors/file-io-locked-error.class.js";
import type FileIONotEmptyError from "../classes/errors/file-io-not-empty-error.class.js";
import type FileIONotFoundError from "../classes/errors/file-io-not-found-error.class.js";
import type FileIOStorageFullError from "../classes/errors/file-io-storage-full-error.class.js";
import type FileIOUnauthorizedError from "../classes/errors/file-io-unauthorized-error.class.js";
import type UnknownError from "../classes/errors/unknown-error.class.js";
import type { FileIOLsEntry } from "./file-io-ls-entry.interface.js";

export interface ExistsMethodFalseResult {
  exists: false;
  error:
    | FileIONotFoundError
    | FileIOBadPathError
    | FileIOUnauthorizedError
    | FileIOBadTypeError;
}

export interface ExistsMethodTrueResult {
  exists: true;
  error: undefined;
}

export type ExistsMethodResult =
  | ExistsMethodTrueResult
  | ExistsMethodFalseResult;

type CommonErrors =
  | UnknownError
  | FileIOConnectionError
  | FileIOBadCredentialsError
  | AppValidationError;

export type LsMethodError =
  | CommonErrors
  | FileIONotFoundError
  | FileIOBadTypeError
  | FileIOBadPathError
  | FileIOUnauthorizedError;

export type ExistsMethodError = CommonErrors;

export type AddMethodError =
  | CommonErrors
  | FileIONotFoundError
  | FileIOBadTypeError
  | FileIOBadPathError
  | FileIOUnauthorizedError
  | FileIOExistsError
  | FileIOCircularReferenceError
  | FileIOLockedError
  | FileIONotEmptyError
  | FileIOStorageFullError;

export type DeleteMethodError =
  | CommonErrors
  | FileIONotFoundError
  | FileIOBadTypeError
  | FileIOBadPathError
  | FileIOUnauthorizedError
  | FileIOLockedError
  | FileIONotEmptyError;

export interface AddFilePayloadOpts {
  overwrite?: boolean;
}

export interface AddFilePayload {
  type: "file";
  srcPath: string;
  dstPath: string;
  opts?: AddFilePayloadOpts;
}

export interface AddDirPayloadOpts {
  overwrite?: boolean;
  recursive?: boolean;
}

export interface AddDirPayload {
  type: "dir";
  srcPath: string;
  dstPath: string;
  opts?: AddDirPayloadOpts;
}

export interface DeleteFilePayloadOpts {
  mustExist?: boolean;
}

export interface DeleteFilePayload {
  type: "file";
  path: string;
  opts?: DeleteFilePayloadOpts;
}

export interface DeleteDirPayloadOpts {
  mustExist?: boolean;
  recursive?: boolean;
}

export interface DeleteDirPayload {
  type: "dir";
  path: string;
  opts?: DeleteDirPayloadOpts;
}

export type AddFileTypePayload = AddFilePayload | AddDirPayload;
export type DeleteFileTypePayload = DeleteFilePayload | DeleteDirPayload;

export interface FileIO {
  ls: (
    dirPath: string,
  ) => Promise<[FileIOLsEntry[], undefined] | [undefined, LsMethodError]>;

  exists: (
    type: "file" | "dir" | "link",
    path: string,
    rights?: "r" | "w" | "rw",
  ) => Promise<
    [ExistsMethodResult, undefined] | [undefined, ExistsMethodError]
  >;

  add: (
    fileTypePayload: AddFileTypePayload,
  ) => Promise<AddMethodError | undefined>;

  delete: (
    fileTypePayload: DeleteFileTypePayload,
  ) => Promise<DeleteMethodError | undefined>;
}
