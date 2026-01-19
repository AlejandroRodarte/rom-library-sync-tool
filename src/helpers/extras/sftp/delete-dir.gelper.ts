import Client from "ssh2-sftp-client";
import dirExists, { type DirExistsError } from "./dir-exists.helper.js";
import rmDir, {
  type RmDirError,
} from "../../wrappers/modules/ssh2-sftp-client/rm-dir.helper.js";
import FileIONotFoundError from "../../../classes/errors/file-io-not-found-error.class.js";
import type { ExistsFalseErrors } from "./exists.helper.js";

export interface DeleteDirOpts {
  mustExist?: boolean;
  recursive?: boolean;
}

export type DeleteDirError = DirExistsError | ExistsFalseErrors | RmDirError;

const deleteDir = async (
  client: Client,
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

  const [dirPathExistsResult, existsError] = await dirExists(client, dirPath);
  if (existsError) return existsError;

  if (!dirPathExistsResult.exists && deleteDirOpts.mustExist)
    return dirPathExistsResult.error;
  if (!dirPathExistsResult.exists && !deleteDirOpts.mustExist) return undefined;

  const rmDirError = await rmDir(client, dirPath, deleteDirOpts.recursive);

  if (rmDirError) {
    if (rmDirError instanceof FileIONotFoundError) return undefined;
    else return rmDirError;
  }
};

export default deleteDir;
