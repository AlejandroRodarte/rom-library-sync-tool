import FileIONotFoundError from "../../../classes/errors/file-io-not-found-error.class.js";
import unlink, {
  type UnlinkError,
} from "../../wrappers/modules/fs/unlink.helper.js";
import type { ExistsFalseErrors } from "./exists.helper.js";
import fileExists, { type FileExistsError } from "./file-exists.helper.js";

export type DeleteFileError = FileExistsError | ExistsFalseErrors | UnlinkError;

export interface DeleteFileOpts {
  mustExist?: boolean;
}

const deleteFile = async (
  filePath: string,
  opts?: DeleteFileOpts,
): Promise<DeleteFileError | undefined> => {
  const deleteFileOpts: Required<DeleteFileOpts> = { mustExist: false };

  if (opts)
    if (typeof opts.mustExist !== "undefined")
      deleteFileOpts.mustExist = opts.mustExist;

  const [filePathExistsResult, existsError] = await fileExists(filePath);
  if (existsError) return existsError;

  if (!filePathExistsResult.exists && deleteFileOpts.mustExist)
    return filePathExistsResult.error;

  if (!filePathExistsResult.exists && !deleteFileOpts.mustExist)
    return undefined;

  const unlinkError = await unlink(filePath);

  if (unlinkError) {
    if (unlinkError instanceof FileIONotFoundError) return undefined;
    else return unlinkError;
  }
};

export default deleteFile;
