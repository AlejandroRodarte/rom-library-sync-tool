import Client from "ssh2-sftp-client";
import fileIO from "../file-io/index.js";
import exists, { type ExistsError } from "./exists.helper.js";
import put, { type PutError } from "./put.helper.js";
import type { FileExistsError } from "../file-io/file-exists.helper.js";

export type AddFileError = FileExistsError | ExistsError | PutError;

const addFile = async (
  client: Client,
  localFilePath: string,
  remoteFilePath: string,
): Promise<AddFileError | undefined> => {
  const localFileExistsError = await fileIO.fileExists(localFilePath);
  if (localFileExistsError) return localFileExistsError;

  const remoteFileExistsError = await exists(client, remoteFilePath, "file");
  if (remoteFileExistsError) return remoteFileExistsError;

  const putError = await put(client, localFilePath, remoteFilePath);
  if (putError) return putError;
};

export default addFile;
