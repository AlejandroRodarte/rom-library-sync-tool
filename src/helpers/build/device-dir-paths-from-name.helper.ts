import path from "path";
import type { DeviceDirPaths } from "../../types.js";
import { DEVICES_DIR_PATH } from "../../constants/paths.constants.js";

const deviceDirPathsFromName = (deviceName: string): DeviceDirPaths => {
  const deviceDirPath = path.join(DEVICES_DIR_PATH, deviceName);
  const deviceDiffsDirPath = path.join(deviceDirPath, "diffs");
  const deviceListsDirPath = path.join(deviceDirPath, "lists");

  return {
    base: deviceDirPath,
    diffs: deviceDiffsDirPath,
    lists: deviceListsDirPath,
  };
};

export default deviceDirPathsFromName;
