import Client from "ssh2-sftp-client";
import fsFileExists, {
  type FileExistsError as FsFileExistsError,
} from "../fs/file-exists.helper.js";
import type { ExistsFalseErrors as FsExistsFalseErrors } from "../fs/exists.helper.js";
import fileExists, {
  type FileExistsError as SftpFileExistsError,
} from "./file-exists.helper.js";
import sftpDelete, {
  type DeleteError,
} from "../../wrappers/modules/ssh2-sftp-client/delete.helper.js";
import put, {
  type PutError,
} from "../../wrappers/modules/ssh2-sftp-client/put.helper.js";

export interface CopyFileFromFsOpts {
  overwrite?: boolean;
}

const fsExtras = {
  fileExists: fsFileExists,
};

export type CopyFileFromFsError =
  | FsFileExistsError
  | FsExistsFalseErrors
  | SftpFileExistsError
  | DeleteError
  | PutError;

const copyFileFromFs = async (
  client: Client,
  srcFilePath: string,
  dstFilePath: string,
  opts?: CopyFileFromFsOpts,
): Promise<CopyFileFromFsError | undefined> => {
  const copyFileFromFsOpts: Required<CopyFileFromFsOpts> = { overwrite: true };

  if (opts)
    if (typeof opts.overwrite !== "undefined")
      copyFileFromFsOpts.overwrite = opts.overwrite;

  const [srcFileExistsResult, srcFileExistsError] =
    await fsExtras.fileExists(srcFilePath);

  if (srcFileExistsError) return srcFileExistsError;
  if (!srcFileExistsResult.exists) return srcFileExistsResult.error;

  const [dstFileExistsResult, dstFileExistsError] = await fileExists(
    client,
    dstFilePath,
  );

  if (dstFileExistsError) return dstFileExistsError;

  if (dstFileExistsResult.exists && !copyFileFromFsOpts.overwrite)
    return undefined;

  if (dstFileExistsResult.exists && copyFileFromFsOpts.overwrite) {
    const deleteError = await sftpDelete(
      client,
      dstFilePath,
      !dstFileExistsResult.exists,
    );
    if (deleteError) return deleteError;
  }

  const putError = await put(client, srcFilePath, dstFilePath);
  if (putError) return putError;
};

export default copyFileFromFs;
