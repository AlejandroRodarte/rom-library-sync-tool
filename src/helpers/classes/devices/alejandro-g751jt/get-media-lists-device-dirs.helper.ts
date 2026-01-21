import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { ConsoleName } from "../../../../types/console-name.type.js";
import type { MediaName } from "../../../../types/media-name.type.js";

const getMediaListsDeviceDirs = (
  paths: AlejandroG751JTPaths["dirs"]["content-targets"],
  consoleNames: ConsoleName[],
  mediaNames: MediaName[],
): string[] => {
  const dirs: string[] = [paths.media.base];

  for (const consoleName of consoleNames) {
    const consoleMediaDir = paths.media.consoles[consoleName];

    if (consoleMediaDir) {
      dirs.push(consoleMediaDir.base);

      for (const mediaName of mediaNames) {
        const consoleMediaNameDir = consoleMediaDir.names[mediaName];
        if (consoleMediaNameDir) dirs.push(consoleMediaNameDir);
      }
    }
  }

  return dirs;
};

export default getMediaListsDeviceDirs;
