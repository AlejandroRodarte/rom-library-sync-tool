import path from "path";
import { DEVICES_DIR_PATH } from "../../constants/paths.constants.js";
import type { DeviceDirPaths } from "../../interfaces/device-dir-paths.interface.js";

const deviceDirPathsFromName = (deviceName: string): DeviceDirPaths => {
  const deviceDirPath = path.join(DEVICES_DIR_PATH, deviceName);
  const deviceDiffsDirPath = path.join(deviceDirPath, "diffs");
  const deviceListsDirPath = path.join(deviceDirPath, "lists");
  const deviceFailedDirPath = path.join(deviceDirPath, "failed");

  return {
    base: deviceDirPath,
    diffs: deviceDiffsDirPath,
    lists: deviceListsDirPath,
    failed: deviceFailedDirPath,
  };
};

export default deviceDirPathsFromName;
