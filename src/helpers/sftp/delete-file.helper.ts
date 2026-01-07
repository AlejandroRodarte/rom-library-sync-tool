import Client from "ssh2-sftp-client";
import exists, { type ExistsError } from "./exists.helper.js";
import SftpNotFoundError from "../../classes/errors/sftp-not-found-error.class.js";
import sftpDelete, { type DeleteError } from "./delete.helper.js";

export type DeleteFileError = ExistsError | DeleteError;

const deleteFile = async (
  client: Client,
  remoteFilePath: string,
  fileMustExist: boolean,
) => {
  const remoteFileExistsError = await exists(client, remoteFilePath, "file");

  if (!fileMustExist) {
    if (remoteFileExistsError) {
      if (remoteFileExistsError instanceof SftpNotFoundError) return undefined;
      return remoteFileExistsError;
    }
  }

  const deleteError = await sftpDelete(client, remoteFilePath);
  if (deleteError) return deleteError;
};

export default deleteFile;
