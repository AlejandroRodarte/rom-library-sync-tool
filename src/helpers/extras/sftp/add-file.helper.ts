import Client from "ssh2-sftp-client";

import put, {
  type PutError,
} from "../../wrappers/modules/ssh2-sftp-client/put.helper.js";
import sftpDelete, {
  type DeleteError,
} from "../../wrappers/modules/ssh2-sftp-client/delete.helper.js";
import sftpFileExists, {
  type FileExistsError as FileIOFileExistsError,
} from "./file-exists.helper.js";
import fsFileExists, {
  type FileExistsError as FsFileExistsError,
} from "../../extras/fs/file-exists.helper.js";
import FileIONotFoundError from "../../../classes/errors/file-io-not-found-error.class.js";

const fsExtras = {
  fileExists: fsFileExists,
};

export type AddFileError =
  | FsFileExistsError
  | FileIOFileExistsError
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
    if (remoteFileExistsError instanceof FileIONotFoundError) {
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
