import Client from "ssh2-sftp-client";
import type { ExistsError } from "../../wrappers/modules/ssh2-sftp-client/exists.helper.js";
import exists from "../../wrappers/modules/ssh2-sftp-client/exists.helper.js";
import FileIOBadTypeError from "../../../classes/errors/file-io-bad-type-error.class.js";
import FileIONotFoundError from "../../../classes/errors/file-io-not-found-error.class.js";

export type DirExistsError =
  | ExistsError
  | FileIOBadTypeError
  | FileIONotFoundError;

const dirExists = async (
  client: Client,
  remoteDirPath: string,
): Promise<DirExistsError | undefined> => {
  const [info, existsError] = await exists(client, remoteDirPath);

  if (existsError) return existsError;
  if (info === false)
    return new FileIONotFoundError(`Filepath ${remoteDirPath} does not exist.`);

  switch (info) {
    case "-":
    case "l":
      return new FileIOBadTypeError(
        `Path ${remoteDirPath} points to a file or link. It does NOT point to a directory.`,
      );
    case "d":
      return undefined;
  }
};

export default dirExists;
