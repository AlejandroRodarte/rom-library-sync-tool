import FileIONotFoundError from "../../../classes/errors/file-io-not-found-error.class.js";
import rm, { type RmError } from "../../wrappers/modules/fs/rm.helper.js";
import dirExists, { type DirExistsError } from "./dir-exists.helper.js";
import type { ExistsFalseErrors } from "./exists.helper.js";

export type DeleteDirError = DirExistsError | RmError | ExistsFalseErrors;

export interface DeleteDirOpts {
  mustExist?: boolean;
  recursive?: boolean;
}

const deleteDir = async (
  dirPath: string,
  opts?: DeleteDirOpts,
): Promise<DeleteDirError | undefined> => {
  const deleteDirOpts: Required<DeleteDirOpts> = {
    mustExist: false,
    recursive: true,
  };

  if (opts) {
    if (typeof opts.mustExist !== "undefined")
      deleteDirOpts.mustExist = opts.mustExist;
    if (typeof opts.recursive !== "undefined")
      deleteDirOpts.recursive = opts.recursive;
  }

  const [dirPathExistsResult, existsError] = await dirExists(dirPath);
  if (existsError) return existsError;

  if (!dirPathExistsResult.exists && deleteDirOpts.mustExist)
    return dirPathExistsResult.error;
  if (!dirPathExistsResult.exists && !deleteDirOpts.mustExist) return undefined;

  const rmError = await rm(dirPath, { recursive: deleteDirOpts.recursive });

  if (rmError) {
    if (rmError instanceof FileIONotFoundError) return undefined;
    else return rmError;
  }
};

export default deleteDir;
