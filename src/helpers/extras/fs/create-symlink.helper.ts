import FileIONotFoundError from "../../../classes/errors/file-io-not-found-error.class.js";
import symlink, {
  type SymlinkError,
} from "../../wrappers/modules/fs/symlink.helper.js";
import unlink, {
  type UnlinkError,
} from "../../wrappers/modules/fs/unlink.helper.js";
import symlinkExists, {
  type SymlinkExistsError,
} from "./symlink-exists.helper.js";

export type CreateSymlinkError =
  | SymlinkExistsError
  | UnlinkError
  | SymlinkError;

export interface CreateSymlinkOpts {
  overwrite?: boolean;
}

const createSymlink = async (
  type: "file" | "dir",
  path: string,
  symlinkPath: string,
  opts?: CreateSymlinkOpts,
): Promise<CreateSymlinkError | undefined> => {
  const createSymlinkOpts: Required<CreateSymlinkOpts> = { overwrite: false };

  if (opts)
    if (typeof opts.overwrite !== "undefined")
      createSymlinkOpts.overwrite = opts.overwrite;

  const [symlinkPathExistsResult, existsError] =
    await symlinkExists(symlinkPath);

  if (existsError) return existsError;
  if (symlinkPathExistsResult.exists && !createSymlinkOpts.overwrite)
    return undefined;

  if (symlinkPathExistsResult.exists && createSymlinkOpts.overwrite) {
    const unlinkError = await unlink(symlinkPath);
    if (unlinkError && !(unlinkError instanceof FileIONotFoundError))
      return unlinkError;
  }

  const symlinkError = await symlink(path, symlinkPath, type);
  if (symlinkError) return symlinkError;
};

export default createSymlink;
