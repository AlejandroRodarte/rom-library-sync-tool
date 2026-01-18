import FileIONotFoundError from "../../../classes/errors/file-io-not-found-error.class.js";
import symlink, {
  type SymlinkError,
} from "../../wrappers/modules/fs/symlink.helper.js";
import unlink, {
  type UnlinkError,
} from "../../wrappers/modules/fs/unlink.helper.js";
import fileExists, { type FileExistsError } from "./file-exists.helper.js";
import symlinkExists, {
  type SymlinkExistsError,
} from "./symlink-exists.helper.js";

export type CreateFileSymlinkError =
  | FileExistsError
  | SymlinkExistsError
  | SymlinkError
  | UnlinkError;

const createFileSymlink = async (
  filePath: string,
  symlinkPath: string,
  strategyIsSymlinkExists: "REPLACE" | "KEEP" = "KEEP",
): Promise<CreateFileSymlinkError | undefined> => {
  const fileAccessError = await fileExists(filePath);
  if (fileAccessError) return fileAccessError;

  const symlinkExistsError = await symlinkExists(symlinkPath);
  if (symlinkExistsError) {
    if (symlinkExistsError instanceof FileIONotFoundError) {
      const createSymlinkError = await symlink(filePath, symlinkPath, "file");
      if (createSymlinkError) return createSymlinkError;
      else return undefined;
    } else symlinkExistsError;
  }

  switch (strategyIsSymlinkExists) {
    case "REPLACE":
      const symlinkDeleteError = unlink(symlinkPath);
      if (symlinkDeleteError) return symlinkDeleteError;
      return undefined;
    case "KEEP":
      return undefined;
  }
};

export default createFileSymlink;
