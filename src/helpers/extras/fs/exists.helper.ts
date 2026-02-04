import type FileIOBadTypeError from "../../../classes/errors/file-io-bad-type-error.class.js";
import FileIONotFoundError from "../../../classes/errors/file-io-not-found-error.class.js";
import FileIOUnauthorizedError from "../../../classes/errors/file-io-unauthorized-error.class.js";
import UnknownError from "../../../classes/errors/unknown-error.class.js";
import type { FsType } from "../../../types/fs-type.type.js";
import type { RightsForValidation } from "../../../types/rights-for-validation.type.js";
import type { ModeFromRightsError } from "../../build/mode-from-rights.helper.js";
import modeFromRights from "../../build/mode-from-rights.helper.js";
import access from "./access.helper.js";

export type ExistsError = ModeFromRightsError | UnknownError;

const build = {
  modeFromRights,
};

export interface ExistsTrueResult {
  exists: true;
  error: undefined;
}

export type ExistsFalseErrors =
  | FileIONotFoundError
  | FileIOUnauthorizedError
  | FileIOBadTypeError;

export interface ExistsFalseResult {
  exists: false;
  error: ExistsFalseErrors;
}

export type ExistsResult = ExistsTrueResult | ExistsFalseResult;

const exists = async (
  type: FsType,
  path: string,
  rights?: RightsForValidation,
): Promise<[ExistsResult, undefined] | [undefined, ExistsError]> => {
  let mode = 0;

  if (rights) {
    const [rightsMode, parsingError] = build.modeFromRights(rights);
    if (parsingError) return [undefined, parsingError];
    mode = rightsMode;
  }

  const accessError = await access(type, path, mode);

  if (accessError) {
    if (!(accessError instanceof UnknownError))
      return [{ exists: false, error: accessError }, undefined];
    else return [undefined, accessError];
  }

  return [{ exists: true, error: undefined }, undefined];
};

export default exists;
