import Client from "ssh2-sftp-client";
import exists, {
  type ExistsError,
} from "../../wrappers/modules/ssh2-sftp-client/exists.helper.js";
import SftpNotFoundError from "../../../classes/errors/sftp-not-found-error.class.js";
import SftpWrongTypeError from "../../../classes/errors/sftp-wrong-type-error.class.js";
import stat, {
  type StatError,
} from "../../wrappers/modules/ssh2-sftp-client/stat.helper.js";
import type { FileRightsFromDecimalError } from "../../build/file-rights-from-decimal-mode.helper.js";
import type { RightsFromIntegerError } from "../../build/rights-from-mode.helper.js";
import fileRightsFromDecimalMode from "../../build/file-rights-from-decimal-mode.helper.js";
import rightsFromMode from "../../build/rights-from-mode.helper.js";

const build = {
  fileRightsFromDecimalMode,
  rightsFromMode,
};

export type AccessError =
  | ExistsError
  | SftpNotFoundError
  | SftpWrongTypeError
  | StatError
  | FileRightsFromDecimalError
  | RightsFromIntegerError;

const access = async (
  client: Client,
  type: "file" | "dir" | "link",
  path: string,
  mode?: number,
): Promise<AccessError | undefined> => {
  const [remotePathType, existsError] = await exists(client, path);
  if (existsError) return existsError;

  if (remotePathType === false)
    return new SftpNotFoundError(`Remote path ${path} does not exist.`);

  switch (remotePathType) {
    case "d":
      if (type !== "dir")
        return new SftpWrongTypeError(
          `Tried to access a ${type}, but remote path ${path} is a directory.`,
        );
      break;
    case "-":
      if (type !== "file")
        return new SftpWrongTypeError(
          `Tried to access a ${type}, but remote path ${path} is a file.`,
        );
      break;
    case "l":
      if (type !== "link")
        return new SftpWrongTypeError(
          `Tried to access a ${type}, but remote path ${path} is a link.`,
        );
      break;
  }

  if (!mode) return undefined;

  const [remotePathStats, statError] = await stat(client, path);
  if (statError) return statError;

  const [remotePathRights, remotePathRightsError] =
    build.fileRightsFromDecimalMode(remotePathStats.mode);
  if (remotePathRightsError) return remotePathRightsError;

  const [desiredRights, desiredRightsError] = build.rightsFromMode(mode);
  if (desiredRightsError) return desiredRightsError;

  if (!remotePathRights.user.includes(desiredRights))
    return new SftpNotFoundError(
      `While remote path ${path} was found and is indeed a ${type}, it only has ${remotePathRights.user} permissions. We need it to have ${desiredRights} permissions.`,
    );
};

export default access;
