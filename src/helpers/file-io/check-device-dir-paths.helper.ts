import type { DeviceDirPaths } from "../../types.js";
import dirExistsAndIsReadableAndWritable, {
  type DirExistsAndIsReadableAndWritableError,
} from "./dir-exists-and-is-readable-and-writable.helper.js";
import dirExists, { type DirExistsError } from "./dir-exists.helper.js";

export type CheckDeviceDirPathsError =
  | DirExistsError
  | DirExistsAndIsReadableAndWritableError;

const checkDeviceDirPaths = async (
  deviceDirPaths: DeviceDirPaths,
): Promise<CheckDeviceDirPathsError | undefined> => {
  const deviceDirPathExistsError = await dirExists(deviceDirPaths.base);
  if (deviceDirPathExistsError) return deviceDirPathExistsError;

  const deviceDiffsDirPathExistsError = await dirExistsAndIsReadableAndWritable(
    deviceDirPaths.diffs,
  );
  if (deviceDiffsDirPathExistsError) return deviceDiffsDirPathExistsError;

  const deviceListsDirPathExistsError = await dirExistsAndIsReadableAndWritable(
    deviceDirPaths.lists,
  );
  if (deviceListsDirPathExistsError) return deviceListsDirPathExistsError;

  const deviceFailedDirPathExistsError =
    await dirExistsAndIsReadableAndWritable(deviceDirPaths.failed);
  if (deviceFailedDirPathExistsError) return deviceFailedDirPathExistsError;
};

export default checkDeviceDirPaths;
