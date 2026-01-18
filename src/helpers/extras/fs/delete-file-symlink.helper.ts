import FileIONotFoundError from "../../../classes/errors/file-io-not-found-error.class.js";
import type UnknownError from "../../../classes/errors/unknown-error.class.js";
import unlink, { type UnlinkError } from "../../wrappers/modules/fs/unlink.helper.js";
import symlinkExists from "./symlink-exists.helper.js";

export type DeleteFileSymlinkError = UnknownError | UnlinkError;

const deleteFileSymlink = async (
  symlinkPath: string,
  symlinkMustExist: boolean = false,
): Promise<DeleteFileSymlinkError | undefined> => {
  const symlinkExistsError = await symlinkExists(symlinkPath);

  if (
    !symlinkMustExist &&
    symlinkExistsError &&
    symlinkExistsError instanceof FileIONotFoundError
  )
    return undefined;

  if (symlinkExistsError) return symlinkExistsError;

  const unlinkError = await unlink(symlinkPath);
  if (unlinkError) return unlinkError;
};

export default deleteFileSymlink;
