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
      const titleIsBios = title.includes(BIOS_TITLE_SEGMENT);
      const keepSelected = 1;

      if (!titleIsBios) {
        unselect.byCountryBasePriorityList(roms, keepSelected);
        unselect.byLanguagesBasePriorityList(roms, keepSelected);
        unselect.byLanguageAmount(roms, keepSelected);
      }
      unselect.byBannedLabelSegmentsImposedBySpecialFlags(roms, keepSelected);
      unselect.byBannedLabelSegments(roms, ["Disk"], keepSelected);
      unselect.byVersionsPriorityList(roms, keepSelected);
      if (!titleIsBios) {
        unselect.byPALAndNTSCLabels(roms, keepSelected);
        unselect.byBannedLabelsBasePriorityList(roms, keepSelected);
        unselect.byWhitelistedLabelsBasePriorityList(roms, keepSelected);
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
