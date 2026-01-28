import Client from "ssh2-sftp-client";
import fsFileExists, {
  type FileExistsError as FsFileExistsError,
} from "../fs/file-exists.helper.js";
import fsUnlink, {
  type UnlinkError as FsUnlinkError,
} from "../../wrappers/modules/fs/unlink.helper.js";
import get from "../../wrappers/modules/ssh2-sftp-client/get.helper.js";
import fileExists, {
  type FileExistsError as SftpFileExistsError,
} from "./file-exists.helper.js";
import type { ExistsFalseErrors as SftpExistsFalseErrors } from "./exists.helper.js";

const fsExtras = {
  fileExists: fsFileExists,
  unlink: fsUnlink,
};

export interface DownloadFileToFsOpts {
  overwrite?: boolean;
}

export type DownloadFileToFsError =
  | FsFileExistsError
  | FsUnlinkError
  | SftpFileExistsError
  | SftpExistsFalseErrors;

const downloadFileToFs = async (
  client: Client,
  srcFilePath: string,
  dstFilePath: string,
  opts?: DownloadFileToFsOpts,
): Promise<DownloadFileToFsError | undefined> => {
  const downloadFileToFsOpts: Required<DownloadFileToFsOpts> = {
    overwrite: true,
  };

  if (opts)
    if (typeof opts.overwrite === "boolean")
      downloadFileToFsOpts.overwrite = opts.overwrite;

  const [fsFileExistsResult, fsFileExistsError] =
    await fsExtras.fileExists(dstFilePath);
  if (fsFileExistsError) return fsFileExistsError;
  if (fsFileExistsResult.exists && !downloadFileToFsOpts.overwrite)
    return undefined;

  if (fsFileExistsResult.exists && downloadFileToFsOpts.overwrite) {
    const unlinkError = await fsUnlink(dstFilePath);
    if (unlinkError) return unlinkError;
  }

  const [sftpFileExistsResult, sftpFileExistsError] = await fileExists(
    client,
    srcFilePath,
  );
  if (sftpFileExistsError) return sftpFileExistsError;
  if (!sftpFileExistsResult.exists) return sftpFileExistsResult.error;

  const [, getError] = await get(client, srcFilePath, dstFilePath);
  if (getError) return getError;
};

export default downloadFileToFs;
