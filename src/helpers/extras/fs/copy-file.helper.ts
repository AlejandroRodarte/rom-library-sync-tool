import fs from "node:fs/promises";

import rawCopyFile, {
  type CopyFileError as RawCopyFileError,
} from "../../wrappers/modules/fs/copy-file.helper.js";
import unlink, {
  type UnlinkError,
} from "../../wrappers/modules/fs/unlink.helper.js";
import fileExists, { type FileExistsError } from "./file-exists.helper.js";
import type { ExistsFalseErrors } from "./exists.helper.js";

export interface CopyFileOpts {
  overwrite?: boolean;
}

export type CopyFileError =
  | RawCopyFileError
  | FileExistsError
  | UnlinkError
  | ExistsFalseErrors;

const copyFile = async (
  srcFilePath: string,
  dstFilePath: string,
  opts?: CopyFileOpts,
): Promise<CopyFileError | undefined> => {
  const copyFileOpts: Required<CopyFileOpts> = { overwrite: false };

  if (opts)
    if (typeof opts.overwrite !== "undefined")
      copyFileOpts.overwrite = opts.overwrite;

  const [srcFileExistsResult, srcFileExistsError] =
    await fileExists(srcFilePath);

  if (srcFileExistsError) return srcFileExistsError;
  if (!srcFileExistsResult.exists) return srcFileExistsResult.error;

  const [dstFileExistsResult, dstFileExistsError] =
    await fileExists(dstFilePath);

  if (dstFileExistsError) return dstFileExistsError;
  if (dstFileExistsResult.exists && !copyFileOpts.overwrite) return undefined;

  if (dstFileExistsResult.exists && copyFileOpts.overwrite) {
    const unlinkError = await unlink(dstFilePath);
    if (unlinkError) return unlinkError;
  }

  const copyFileError = await rawCopyFile(
    srcFilePath,
    dstFilePath,
    copyFileOpts.overwrite ? undefined : fs.constants.COPYFILE_EXCL,
  );

  if (copyFileError) return copyFileError;
};

export default copyFile;
