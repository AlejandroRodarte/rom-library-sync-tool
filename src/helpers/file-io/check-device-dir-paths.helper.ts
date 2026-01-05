import type { DeviceDirPaths } from "../../types.js";
import dirExistsAndIsReadableAndWritable from "./dir-exists-and-is-readable-and-writable.helper.js";
import dirExists from "./dir-exists.helper.js";

const checkDeviceDirPaths = async (
  deviceDirPaths: DeviceDirPaths,
): Promise<Error | undefined> => {
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
};

export default checkDeviceDirPaths;
