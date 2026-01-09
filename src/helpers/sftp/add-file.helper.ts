import Client from "ssh2-sftp-client";
import fileIO from "../file-io/index.js";
import exists, { type ExistsError } from "./exists.helper.js";
import put, { type PutError } from "./put.helper.js";
import type { FileExistsError } from "../file-io/file-exists.helper.js";
import SftpNotFoundError from "../../classes/errors/sftp-not-found-error.class.js";
import sftpDelete, { type DeleteError } from "./delete.helper.js";

export type AddFileError =
  | FileExistsError
  | ExistsError
  | PutError
  | DeleteError;

const addFile = async (
  client: Client,
  localFilePath: string,
  remoteFilePath: string,
  strategyIfRemoteFileExists: "REPLACE" | "KEEP" = "KEEP",
): Promise<AddFileError | undefined> => {
  const localFileExistsError = await fileIO.fileExists(localFilePath);
  if (localFileExistsError) return localFileExistsError;

  const remoteFileExistsError = await exists(client, remoteFilePath, "file");

  if (remoteFileExistsError) {
    if (remoteFileExistsError instanceof SftpNotFoundError) {
      const putError = await put(client, localFilePath, remoteFilePath);
      if (putError) return putError;
      else return undefined;
    } else return remoteFileExistsError;
  }

  switch (strategyIfRemoteFileExists) {
    case "REPLACE":
      const remoteFileDeleteError = await sftpDelete(
        client,
        remoteFilePath,
        true,
      );
      if (remoteFileDeleteError) return remoteFileDeleteError;

      const putError = await put(client, localFilePath, remoteFilePath);
      if (putError) return putError;
      return undefined;
    case "KEEP":
      return undefined;
  }
};

export default addFile;
