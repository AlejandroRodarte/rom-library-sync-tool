import Client from "ssh2-sftp-client";
import fsDirExists, {
  type DirExistsError as FsDirExistsError,
} from "../fs/dir-exists.helper.js";
import fsRm, {
  type RmError as FsRmError,
} from "../../wrappers/modules/fs/rm.helper.js";
import dirExists, {
  type DirExistsError as SftpDirExistsError,
} from "./dir-exists.helper.js";
import type { ExistsFalseErrors as SftpExistsFalseErrors } from "./exists.helper.js";
import downloadDir from "../../wrappers/modules/ssh2-sftp-client/download-dir.helper.js";

const fsExtras = {
  dirExists: fsDirExists,
  rm: fsRm,
};

export interface DownloadDirToFsOpts {
  overwrite?: boolean;
}

export type DownloadDirToFsError =
  | FsDirExistsError
  | FsRmError
  | SftpDirExistsError
  | SftpExistsFalseErrors;

const downloadDirToFs = async (
  client: Client,
  srcDirPath: string,
  dstDirPath: string,
  opts?: DownloadDirToFsOpts,
): Promise<DownloadDirToFsError | undefined> => {
  const downloadDirToFsOpts: Required<DownloadDirToFsOpts> = {
    overwrite: true,
  };

  if (opts)
    if (typeof opts.overwrite === "boolean")
      downloadDirToFsOpts.overwrite = opts.overwrite;

  const [sftpDirExistsResult, sftpDirExistsError] = await dirExists(
    client,
    srcDirPath,
  );
  if (sftpDirExistsError) return sftpDirExistsError;
  if (!sftpDirExistsResult.exists) return sftpDirExistsResult.error;

  const [fsDirExistsResult, fsDirExistsError] =
    await fsExtras.dirExists(dstDirPath);
  if (fsDirExistsError) return fsDirExistsError;
  if (fsDirExistsResult.exists && !downloadDirToFsOpts.overwrite)
    return undefined;

  if (fsDirExistsResult.exists && downloadDirToFsOpts.overwrite) {
    const rmError = await fsExtras.rm(dstDirPath, { recursive: true });
    if (rmError) return rmError;
  }

  const [, downloadDirError] = await downloadDir(
    client,
    srcDirPath,
    dstDirPath,
  );
  if (downloadDirError) return downloadDirError;
};

export default downloadDirToFs;
