import type { PathLike } from "node:fs";
import FileIOBadTypeError from "../../../classes/errors/file-io-bad-type-error.class.js";
import rawAccess, {
  type AccessError as RawAccessError,
} from "../../wrappers/modules/fs/access.helper.js";
import stat, { type StatError } from "../../wrappers/modules/fs/stat.helper.js";
import type { FsType } from "../../../types/fs-type.type.js";
import { DIR, FILE, LINK } from "../../../constants/fs/fs-types.constants.js";

export type AccessError = RawAccessError | StatError | FileIOBadTypeError;

const access = async (
  type: FsType,
  path: PathLike,
  mode?: number,
): Promise<undefined | AccessError> => {
  const accessError = await rawAccess(path, mode);
  if (accessError) return accessError;

  const [pathStats, statsError] = await stat(path);
  if (statsError) return statsError;

  switch (type) {
    case FILE:
      if (!pathStats.isFile())
        return new FileIOBadTypeError(
          `Path ${path} exists, but is NOT a file.`,
        );
      break;
    case DIR:
      if (!pathStats.isDirectory())
        return new FileIOBadTypeError(
          `Path ${path} exists, but is NOT a directory.`,
        );
      break;
    case LINK:
      if (!pathStats.isSymbolicLink())
        return new FileIOBadTypeError(
          `Path ${path} exists, but is NOT a symbolic link.`,
        );
      break;
  }
};

export default access;
