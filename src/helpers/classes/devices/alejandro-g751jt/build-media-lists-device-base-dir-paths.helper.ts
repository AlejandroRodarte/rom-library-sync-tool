import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";

const buildMediaListsDeviceBaseDirPaths = (
  paths: AlejandroG751JTPaths["dirs"]["content-targets"]["media"],
): string[] => {
  const devicePaths: string[] = [paths.base];

  for (const [, consoleMediaDirPaths] of Object.entries(paths.consoles))
    devicePaths.push(consoleMediaDirPaths.base);

  return devicePaths;
};

export default buildMediaListsDeviceBaseDirPaths;
