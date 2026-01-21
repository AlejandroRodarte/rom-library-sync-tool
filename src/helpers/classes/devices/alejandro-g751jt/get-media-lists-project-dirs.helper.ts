import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { MediaName } from "../../../../types/media-name.type.js";

const getMediaListsProjectDirs = (
  paths: AlejandroG751JTPaths["dirs"]["project"]["lists"]["content-targets"]["media"],
  mediaNames: MediaName[],
) => {
  const dirs: string[] = [paths.base];

  for (const mediaName of mediaNames) {
    const mediaNameDir = paths.names[mediaName];
    if (mediaNameDir) dirs.push(mediaNameDir);
  }

  return dirs;
};

export default getMediaListsProjectDirs;
