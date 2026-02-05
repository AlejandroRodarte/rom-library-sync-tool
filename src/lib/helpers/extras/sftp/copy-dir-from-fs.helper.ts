import Client from "ssh2-sftp-client";

import type { RmDirError } from "../../wrappers/modules/ssh2-sftp-client/rm-dir.helper.js";
import type { UploadDirError } from "../../wrappers/modules/ssh2-sftp-client/upload-dir.helper.js";
import fsDirExists, {
  type DirExistsError as FsDirExistsError,
} from "../../extras/fs/dir-exists.helper.js";
import { type ExistsFalseErrors as FsExistsFalseErrors } from "../../extras/fs/exists.helper.js";
import dirExists, {
  type DirExistsError as SftpDirExistsError,
} from "./dir-exists.helper.js";
import rmDir from "../../wrappers/modules/ssh2-sftp-client/rm-dir.helper.js";
import uploadDir from "../../wrappers/modules/ssh2-sftp-client/upload-dir.helper.js";

const fsExtras = {
  dirExists: fsDirExists,
};

export interface CopyDirFromFsOpts {
  overwrite?: boolean;
  recursive?: boolean;
}

export type CopyDirFromFsError =
  | FsDirExistsError
  | FsExistsFalseErrors
  | SftpDirExistsError
  | RmDirError
  | UploadDirError;

const copyDirFromFs = async (
  client: Client,
  srcDirPath: string,
  dstDirPath: string,
  opts?: CopyDirFromFsOpts,
): Promise<CopyDirFromFsError | undefined> => {
  const copyDirFromFsOpts: Required<CopyDirFromFsOpts> = {
    overwrite: false,
    recursive: true,
  };

  if (opts) {
    if (typeof opts.overwrite !== "undefined")
      copyDirFromFsOpts.overwrite = opts.overwrite;
    if (typeof opts.recursive !== "undefined")
      copyDirFromFsOpts.recursive = opts.recursive;
  }

  const [srcDirExistsResult, srcDirExistsError] =
    await fsExtras.dirExists(srcDirPath);

  if (srcDirExistsError) return srcDirExistsError;
  if (!srcDirExistsResult.exists) return srcDirExistsResult.error;

  const [dstDirExistsResult, dstDirExistsError] = await dirExists(
    client,
    dstDirPath,
  );
  if (dstDirExistsError) return dstDirExistsError;

  if (dstDirExistsResult.exists && !copyDirFromFsOpts.overwrite)
    return undefined;

  if (dstDirExistsResult.exists && copyDirFromFsOpts.overwrite) {
    const rmDirError = await rmDir(
      client,
      dstDirPath,
      copyDirFromFsOpts.recursive,
    );
    if (rmDirError) return rmDirError;
  }

  const uploadDirError = await uploadDir(client, srcDirPath, dstDirPath);
  if (uploadDirError) return uploadDirError;
};

export default copyDirFromFs;
