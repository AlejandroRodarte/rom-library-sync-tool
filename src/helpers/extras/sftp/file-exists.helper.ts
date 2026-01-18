import Client from "ssh2-sftp-client";
import type { ExistsError } from "../../wrappers/modules/ssh2-sftp-client/exists.helper.js";
import exists from "../../wrappers/modules/ssh2-sftp-client/exists.helper.js";
import FileIOBadTypeError from "../../../classes/errors/file-io-bad-type-error.class.js";
import FileIONotFoundError from "../../../classes/errors/file-io-not-found-error.class.js";

export type FileExistsError =
  | ExistsError
  | FileIOBadTypeError
  | FileIONotFoundError;

const fileExists = async (
  client: Client,
  remoteFilePath: string,
): Promise<FileExistsError | undefined> => {
  const [info, existsError] = await exists(client, remoteFilePath);

  if (existsError) return existsError;
  if (info === false)
    return new FileIONotFoundError(
      `Filepath ${remoteFilePath} does not exist.`,
    );

  switch (info) {
    case "d":
    case "l":
      return new FileIOBadTypeError(
        `Path ${remoteFilePath} points to a directory or a link. It does NOT point to a file.`,
      );
    case "-":
      return undefined;
  }
};

export default fileExists;
