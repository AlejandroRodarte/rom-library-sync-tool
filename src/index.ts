import ENVIRONMENT from "./constants/environment.constant.js";

import { BIOS_TITLE_SEGMENT } from "./constants/title-segments.constnats.js";
import add from "./helpers/add/index.js";
import fileIO from "./helpers/file-io/index.js";
import log from "./helpers/log/index.js";
import build from "./helpers/build/index.js";
import unselect from "./helpers/unselect/index.js";

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

  for (const [name, konsole] of consoles)
    await fileIO.writeConsoleDiffFile(name, konsole);
};

main();
