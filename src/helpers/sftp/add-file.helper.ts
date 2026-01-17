import Client from "ssh2-sftp-client";

import SftpNotFoundError from "../../classes/errors/sftp-not-found-error.class.js";
import put, {
  type PutError,
} from "../wrappers/modules/ssh2-sftp-client/put.helper.js";
import sftpDelete, {
  type DeleteError,
} from "../wrappers/modules/ssh2-sftp-client/delete.helper.js";
import sftpFileExists, {
  type FileExistsError as SftpFileExistsError,
} from "./file-exists.helper.js";
import fsFileExists, {
  type FileExistsError as FsFileExistsError,
} from "../extras/fs/file-exists.helper.js";

const fsExtras = {
  fileExists: fsFileExists,
};

export type AddFileError =
  | FsFileExistsError
  | SftpFileExistsError
  | PutError
  | DeleteError;

const addFile = async (
  client: Client,
  localFilePath: string,
  remoteFilePath: string,
  strategyIfRemoteFileExists: "REPLACE" | "KEEP" = "KEEP",
): Promise<AddFileError | undefined> => {
  const localFileExistsError = await fsExtras.fileExists(localFilePath);
  if (localFileExistsError) return localFileExistsError;

  const remoteFileExistsError = await sftpFileExists(client, remoteFilePath);

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
