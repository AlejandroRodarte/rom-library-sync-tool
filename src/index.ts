import { BIOS_TITLE_SEGMENT } from "./constants/title-segments.constnats.js";
import add from "./helpers/add/index.js";
import fileIO from "./helpers/file-io/index.js";
import log from "./helpers/log/index.js";
import build from "./helpers/build/index.js";
import unselect from "./helpers/unselect/index.js";

const main = async () => {
  const consoles = build.emptyConsoles();

  for (const [name, konsole] of consoles) {
    const groups = await build.groupsFromConsoleName(name);

    for (const [title, roms] of groups) {
      let type: "normal" | "bios" = "normal";
      const titleIsBios = title.includes(BIOS_TITLE_SEGMENT);
      if (titleIsBios) type = "bios";

      const keepSelected = 1;
      switch (type) {
        case "normal":
          unselect.byNormalTitle(roms, keepSelected);
          break;
        case "bios":
          unselect.byBiosTitle(roms, keepSelected);
          break;
        default:
          break;
      }

      add.romsToConsole(roms, konsole, title);
    }
  }

  for (const [_, konsole] of consoles) log.consoleDuplicates(konsole);
  log.consolesReport(consoles);

  const generateFiles = false;
  if (generateFiles)
    for (const [name, konsole] of consoles)
      fileIO.writeConsoleFiles(name, konsole);
};

main();
