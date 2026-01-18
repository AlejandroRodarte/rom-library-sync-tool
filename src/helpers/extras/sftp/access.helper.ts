import Client from "ssh2-sftp-client";
import exists, {
  type ExistsError,
} from "../../wrappers/modules/ssh2-sftp-client/exists.helper.js";
import stat, {
  type StatError,
} from "../../wrappers/modules/ssh2-sftp-client/stat.helper.js";
import type { FileRightsFromDecimalError } from "../../build/file-rights-from-decimal-mode.helper.js";
import type { RightsFromIntegerError } from "../../build/rights-from-mode.helper.js";
import fileRightsFromDecimalMode from "../../build/file-rights-from-decimal-mode.helper.js";
import rightsFromMode from "../../build/rights-from-mode.helper.js";
import FileIOBadTypeError from "../../../classes/errors/file-io-bad-type-error.class.js";
import FileIONotFoundError from "../../../classes/errors/file-io-not-found-error.class.js";

const build = {
  fileRightsFromDecimalMode,
  rightsFromMode,
};

export type AccessError =
  | ExistsError
  | FileIONotFoundError
  | FileIOBadTypeError
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
    return new FileIONotFoundError(`Remote path ${path} does not exist.`);

  switch (remotePathType) {
    case "d":
      if (type !== "dir")
        return new FileIOBadTypeError(
          `Tried to access a ${type}, but remote path ${path} is a directory.`,
        );
      break;
    case "-":
      if (type !== "file")
        return new FileIOBadTypeError(
          `Tried to access a ${type}, but remote path ${path} is a file.`,
        );
      break;
    case "l":
      if (type !== "link")
        return new FileIOBadTypeError(
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
    return new FileIONotFoundError(
      `While remote path ${path} was found and is indeed a ${type}, it only has ${remotePathRights.user} permissions. We need it to have ${desiredRights} permissions.`,
    );
};

export default access;
