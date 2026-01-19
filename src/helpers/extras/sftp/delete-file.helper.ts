import Client from "ssh2-sftp-client";
import fileExists, { type FileExistsError } from "./file-exists.helper.js";
import sftpDelete, {
  type DeleteError,
} from "../../wrappers/modules/ssh2-sftp-client/delete.helper.js";
import FileIONotFoundError from "../../../classes/errors/file-io-not-found-error.class.js";
import type { ExistsFalseErrors } from "./exists.helper.js";

export interface DeleteFileOpts {
  mustExist?: boolean;
}

export type DeleteFileError = FileExistsError | ExistsFalseErrors | DeleteError;

const deleteFile = async (
  client: Client,
  filePath: string,
  opts?: DeleteFileOpts,
): Promise<DeleteFileError | undefined> => {
  const deleteFileOpts: Required<DeleteFileOpts> = { mustExist: false };

  const [fileExistsResult, existsError] = await fileExists(client, filePath);

  if (existsError) return existsError;

  if (!fileExistsResult.exists && deleteFileOpts.mustExist)
    return fileExistsResult.error;

  if (!fileExistsResult.exists && !deleteFileOpts.mustExist) return undefined;

  const deleteError = await sftpDelete(
    client,
    filePath,
    !deleteFileOpts.mustExist,
  );

  if (deleteError) {
    if (deleteError instanceof FileIONotFoundError) return undefined;
    else return deleteError;
  }
};

export default deleteFile;
