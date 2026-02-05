import FileIONotFoundError from "../../../classes/errors/file-io-not-found-error.class.js";
import unlink, {
  type UnlinkError,
} from "../../wrappers/modules/fs/unlink.helper.js";
import type { ExistsFalseErrors } from "./exists.helper.js";
import symlinkExists, {
  type SymlinkExistsError,
} from "./symlink-exists.helper.js";

export type DeleteSymlinkError =
  | SymlinkExistsError
  | UnlinkError
  | ExistsFalseErrors;

export interface DeleteSymlinkOpts {
  mustExist?: boolean;
}

const deleteSymlink = async (
  symlinkPath: string,
  opts?: DeleteSymlinkOpts,
): Promise<DeleteSymlinkError | undefined> => {
  const deleteSymlinkOpts: Required<DeleteSymlinkOpts> = { mustExist: false };

  if (opts)
    if (typeof opts.mustExist !== "undefined")
      deleteSymlinkOpts.mustExist = opts.mustExist;

  const [symlinkPathExists, existsError] = await symlinkExists(symlinkPath);

  if (existsError) return existsError;

  if (!symlinkPathExists.exists && !deleteSymlinkOpts.mustExist)
    return undefined;
  if (!symlinkPathExists.exists && deleteSymlinkOpts.mustExist)
    return symlinkPathExists.error;

  const unlinkError = await unlink(symlinkPath);

  if (unlinkError && unlinkError instanceof FileIONotFoundError)
    return undefined;
  return unlinkError;
};

export default deleteSymlink;
