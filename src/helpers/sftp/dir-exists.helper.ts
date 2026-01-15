import Client from "ssh2-sftp-client";
import type { ExistsError } from "../wrappers/modules/ssh2-sftp-client/exists.helper.js";
import exists from "../wrappers/modules/ssh2-sftp-client/exists.helper.js";
import SftpNotFoundError from "../../classes/errors/sftp-not-found-error.class.js";
import SftpWrongTypeError from "../../classes/errors/sftp-wrong-type-error.class.js";

export type DirExistsError = ExistsError | SftpWrongTypeError | SftpNotFoundError;

const dirExists = async (client: Client, remoteDirPath: string): Promise<DirExistsError | undefined> => {
  const [info, existsError] = await exists(client, remoteDirPath);

  if (existsError) return existsError;
  if (info === false)
    return new SftpNotFoundError(`Filepath ${remoteDirPath} does not exist.`);

  switch (info) {
    case "-":
    case "l":
      return new SftpWrongTypeError(`Path ${remoteDirPath} points to a file or link. It does NOT point to a directory.`)
    case "d":
      return undefined;
  }
};

export default dirExists;
