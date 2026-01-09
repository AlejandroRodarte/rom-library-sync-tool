import FsNotFoundError from "../../classes/errors/fs-not-found-error.class.js";
import fileExists, { type FileExistsError } from "./file-exists.helper.js";
import symlinkExists, {
  type SymlinkExistsError,
} from "./symlink-exists.helper.js";
import symlink, { type SymlinkError } from "./symlink.helper.js";
import unlink, { type UnlinkError } from "./unlink.helper.js";

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
    if (symlinkExistsError instanceof FsNotFoundError) {
      const createSymlinkError = await symlink([filePath, symlinkPath, "file"]);
      if (createSymlinkError) return createSymlinkError;
      else return undefined;
    } else symlinkExistsError;
  }

  switch (strategyIsSymlinkExists) {
    case "REPLACE":
      const symlinkDeleteError = unlink([symlinkPath]);
      if (symlinkDeleteError) return symlinkDeleteError;
      return undefined;
    case "KEEP":
      return undefined;
  }
};

export default createFileSymlink;
