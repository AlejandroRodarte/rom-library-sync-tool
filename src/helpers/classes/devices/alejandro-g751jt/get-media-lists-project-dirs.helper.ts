import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { MediaName } from "../../../../types/media-name.type.js";

const getMediaListsProjectDirs = (
  paths: AlejandroG751JTPaths["dirs"]["project"]["lists"],
  mediaNames: MediaName[],
) => {
  const dirs: string[] = [paths["content-targets"].media.base];

  for (const mediaName of mediaNames) {
    const mediaNameDir = paths["content-targets"].media.names[mediaName];
    if (mediaNameDir) dirs.push(mediaNameDir);
  }

  return dirs;
};

export default getMediaListsProjectDirs;
