import ENVIRONMENT from "./constants/environment.constant.js";

import { BIOS_TITLE_SEGMENT } from "./constants/title-segments.constnats.js";
import add from "./helpers/add/index.js";
import fileIO from "./helpers/file-io/index.js";
import log from "./helpers/log/index.js";
import build from "./helpers/build/index.js";
import unselect from "./helpers/unselect/index.js";
import {
  DEVICES_DIR_PATH,
  LOCAL_ROM_DIFFS_DIR_PATH,
  LOCAL_ROM_LISTS_DIR_PATH,
} from "./constants/paths.constants.js";
import path from "node:path";
import DEVICE_NAMES from "./constants/device-names.constant.js";
import dirExists from "./helpers/file-io/dir-exists.helper.js";
import dirExistsAndIsReadableAndWritable from "./helpers/file-io/dir-exists-and-is-readable-and-writable.helper.js";
import type { DeviceDirPaths } from "./types.js";

const main = async () => {
  const consoles = build.emptyConsoles();

  for (const [name, konsole] of consoles) {
    const titles = await build.titlesFromConsoleName(name);

    for (const [name, title] of titles) {
      let type: "normal" | "bios" = "normal";
      const titleIsBios = name.includes(BIOS_TITLE_SEGMENT);
      if (titleIsBios) type = "bios";

      switch (type) {
        case "normal":
          unselect.byNormalTitle(title);
          break;
        case "bios":
          unselect.byBiosTitle(title);
          break;
        default:
          break;
      }

      add.titleToConsole(title, konsole);
    }
  }

  for (const [_, konsole] of consoles) log.consoleDuplicates(konsole);
  log.consolesReport(consoles);

  for (const [name, konsole] of consoles) {
    for (const device of DEVICE_NAMES) {
      const deviceDirPath = path.join(DEVICES_DIR_PATH, device);

      const deviceDirPathExistsError = await dirExists(deviceDirPath);
      if (deviceDirPathExistsError) {
        console.log(deviceDirPathExistsError.message);
        console.log("Terminating program.");
        return;
      }

      const deviceDiffsDirPath = path.join(deviceDirPath, "diffs");

      const deviceDiffsDirPathExistsError =
        await dirExistsAndIsReadableAndWritable(deviceDiffsDirPath);
      if (deviceDiffsDirPathExistsError) {
        console.log(deviceDiffsDirPathExistsError.message);
        console.log("Terminating program.");
        return;
      }

      const deviceListsDirPath = path.join(deviceDirPath, "lists");

      const deviceListsDirPathExistsError =
        await dirExistsAndIsReadableAndWritable(deviceListsDirPath);
      if (deviceListsDirPathExistsError) {
        console.log(deviceListsDirPathExistsError.message);
        console.log("Terminating program.");
        return;
      }

      const deviceDirPaths: DeviceDirPaths = {
        diffs: deviceDiffsDirPath,
        lists: deviceListsDirPath,
      };

      await fileIO.writeConsoleDiffFile(name, konsole, deviceDirPaths);

      if (ENVIRONMENT.files.replaceLists)
        await fileIO.writeConsoleListFile(name, konsole, deviceDirPaths.lists);
    }
  }
};

main();
