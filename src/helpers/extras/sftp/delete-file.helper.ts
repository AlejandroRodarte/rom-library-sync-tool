import Client from "ssh2-sftp-client";
import sftpDelete, {
  type DeleteError,
} from "../../wrappers/modules/ssh2-sftp-client/delete.helper.js";
import fileExists, { type FileExistsError } from "./file-exists.helper.js";
import FileIONotFoundError from "../../../classes/errors/file-io-not-found-error.class.js";

export type DeleteFileError = FileExistsError | DeleteError;

const deleteFile = async (
  client: Client,
  remoteFilePath: string,
  fileMustExist: boolean,
): Promise<DeleteFileError | undefined> => {
  const remoteFileExistsError = await fileExists(client, remoteFilePath);

  if (
    !fileMustExist &&
    remoteFileExistsError &&
    remoteFileExistsError instanceof FileIONotFoundError
  )
    return undefined;

  if (remoteFileExistsError) return remoteFileExistsError;

  const deleteError = await sftpDelete(client, remoteFilePath, !fileMustExist);
  if (deleteError) return deleteError;
};

export default deleteFile;
