import Client from "ssh2-sftp-client";
import type { ExistsError } from "../wrappers/modules/ssh2-sftp-client/exists.helper.js";
import exists from "../wrappers/modules/ssh2-sftp-client/exists.helper.js";
import SftpNotFoundError from "../../classes/errors/sftp-not-found-error.class.js";
import SftpWrongTypeError from "../../classes/errors/sftp-wrong-type-error.class.js";

export type FileExistsError = ExistsError | SftpWrongTypeError | SftpNotFoundError;

const fileExists = async (client: Client, remoteFilePath: string): Promise<FileExistsError | undefined> => {
  const [info, existsError] = await exists(client, remoteFilePath);

  if (existsError) return existsError;
  if (info === false)
    return new SftpNotFoundError(`Filepath ${remoteFilePath} does not exist.`);

  switch (info) {
    case "d":
    case "l":
      return new SftpWrongTypeError(`Path ${remoteFilePath} points to a directory or a link. It does NOT point to a file.`)
    case "-":
      return undefined;
  }
};

export default fileExists;
