import Client from "ssh2-sftp-client";
import exists, {
  type ExistsError,
} from "../../wrappers/modules/ssh2-sftp-client/exists.helper.js";
import stat, {
  type StatError,
} from "../../wrappers/modules/ssh2-sftp-client/stat.helper.js";
import type { BuildFileRightsFromDecimalError } from "../../build/rights/build-file-rights-set-from-decimal-mode.helper.js";
import type { BuildRightsFromIntegerError } from "../../build/rights/build-rights-from-mode.helper.js";
import buildFileRightsSetFromDecimalMode from "../../build/rights/build-file-rights-set-from-decimal-mode.helper.js";
import buildRightsFromMode from "../../build/rights/build-rights-from-mode.helper.js";
import FileIOBadTypeError from "../../../classes/errors/file-io-bad-type-error.class.js";
import FileIONotFoundError from "../../../classes/errors/file-io-not-found-error.class.js";
import FileIOUnauthorizedError from "../../../classes/errors/file-io-unauthorized-error.class.js";
import type { FsType } from "../../../types/fs-type.type.js";
import { DIR, FILE, LINK } from "../../../constants/fs/fs-types.constants.js";

const build = {
  fileRightsFromDecimalMode: buildFileRightsSetFromDecimalMode,
  rightsFromMode: buildRightsFromMode,
};

export type AccessError =
  | ExistsError
  | FileIONotFoundError
  | FileIOBadTypeError
  | StatError
  | BuildFileRightsFromDecimalError
  | BuildRightsFromIntegerError
  | FileIOUnauthorizedError;

const access = async (
  client: Client,
  type: FsType,
  path: string,
  mode?: number,
): Promise<AccessError | undefined> => {
  const [remotePathType, existsError] = await exists(client, path);
  if (existsError) return existsError;

  if (remotePathType === false)
    return new FileIONotFoundError(`Remote path ${path} does not exist.`);

  switch (remotePathType) {
    case "d":
      if (type !== DIR)
        return new FileIOBadTypeError(
          `Tried to access a ${type}, but remote path ${path} is a directory.`,
        );
      break;
    case "-":
      if (type !== FILE)
        return new FileIOBadTypeError(
          `Tried to access a ${type}, but remote path ${path} is a file.`,
        );
      break;
    case "l":
      if (type !== LINK)
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
    return new FileIOUnauthorizedError(
      `While remote path ${path} was found and is indeed a ${type}, it only has ${remotePathRights.user} permissions. We need it to have ${desiredRights} permissions.`,
    );
};

export default access;
