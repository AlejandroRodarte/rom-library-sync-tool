import Client from "ssh2-sftp-client";
import SftpNotFoundError from "../../classes/errors/sftp-not-found-error.class.js";
import sftpDelete, { type DeleteError } from "../wrappers/modules/ssh2-sftp-client/delete.helper.js";
import fileExists, { type FileExistsError } from "./file-exists.helper.js";

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
    remoteFileExistsError instanceof SftpNotFoundError
  )
    return undefined;

  if (remoteFileExistsError) return remoteFileExistsError;

  const deleteError = await sftpDelete(client, remoteFilePath, !fileMustExist);
  if (deleteError) return deleteError;
};

export default deleteFile;
