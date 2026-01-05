import ENVIRONMENT from "./constants/environment.constant.js";

import { BIOS_TITLE_SEGMENT } from "./constants/title-segments.constnats.js";
import add from "./helpers/add/index.js";
import fileIO from "./helpers/file-io/index.js";
import log from "./helpers/log/index.js";
import build from "./helpers/build/index.js";
import unselect from "./helpers/unselect/index.js";
import {
  LOCAL_ROM_DIFFS_DIR_PATH,
  LOCAL_ROM_LISTS_DIR_PATH,
} from "./constants/paths.constants.js";
import path from "node:path";

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
    const localDiffsDirExistsError =
      await fileIO.dirExistsAndIsReadableAndWritable(LOCAL_ROM_DIFFS_DIR_PATH);
    if (localDiffsDirExistsError) {
      console.log(localDiffsDirExistsError.message);
      console.log("Terminating program.");
      return;
    }

    await fileIO.writeConsoleDiffFile(name, konsole);

    if (ENVIRONMENT.files.replaceLists) {
      const localListsDirExistsError =
        await fileIO.dirExistsAndIsReadableAndWritable(
          LOCAL_ROM_LISTS_DIR_PATH,
        );
      if (localListsDirExistsError) {
        console.log(localListsDirExistsError.message);
        console.log("Terminating program and rolling back.");
        for (const [name] of consoles) {
          const diffFilePath = path.resolve(
            LOCAL_ROM_DIFFS_DIR_PATH,
            `${name}.diff.txt`,
          );
          await fileIO.findAndDeleteFile(diffFilePath, false);
        }
        return;
      }

      await fileIO.writeConsoleListFile(name, konsole);
    }
  }
};

main();
