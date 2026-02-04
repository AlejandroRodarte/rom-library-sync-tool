import Client from "ssh2-sftp-client";
import FileIONotFoundError from "../../../classes/errors/file-io-not-found-error.class.js";
import FileIOUnauthorizedError from "../../../classes/errors/file-io-unauthorized-error.class.js";
import FileIOBadPathError from "../../../classes/errors/file-io-bad-path-error.class.js";
import FileIOBadTypeError from "../../../classes/errors/file-io-bad-type-error.class.js";
import modeFromRights, {
  type ModeFromRightsError,
} from "../../build/mode-from-rights.helper.js";
import access from "./access.helper.js";
import type UnknownError from "../../../classes/errors/unknown-error.class.js";
import type FileIOConnectionError from "../../../classes/errors/file-io-connection-error.class.js";
import type FileIOBadCredentialsError from "../../../classes/errors/file-io-bad-credentials-error.class.js";
import type { FsType } from "../../../types/fs-type.type.js";
import type { RightsForValidation } from "../../../types/rights-for-validation.type.js";

export type ExistsFalseErrors =
  | FileIONotFoundError
  | FileIOUnauthorizedError
  | FileIOBadPathError
  | FileIOBadTypeError;

export interface ExistsFalseResult {
  exists: false;
  error: ExistsFalseErrors;
}

export interface ExistsTrueResult {
  exists: true;
  error: undefined;
}

export type ExistsResult = ExistsFalseResult | ExistsTrueResult;

export type ExistsError =
  | ModeFromRightsError
  | UnknownError
  | FileIOConnectionError
  | FileIOBadCredentialsError;

const exists = async (
  client: Client,
  type: FsType,
  path: string,
  rights?: RightsForValidation,
): Promise<[ExistsResult, undefined] | [undefined, ExistsError]> => {
  let mode = 0;

  if (rights) {
    const [rightsMode, parsingError] = modeFromRights(rights);
    if (parsingError) return [undefined, parsingError];
    mode = rightsMode;
  }

  const accessError = await access(client, type, path, mode);

  if (accessError)
    if (
      accessError instanceof FileIONotFoundError ||
      accessError instanceof FileIOUnauthorizedError ||
      accessError instanceof FileIOBadTypeError ||
      accessError instanceof FileIOBadPathError
    )
      return [{ exists: false, error: accessError }, undefined];
    else return [undefined, accessError];

  return [{ exists: true, error: undefined }, undefined];
};

export default exists;
