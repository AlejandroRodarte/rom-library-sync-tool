import emptyConsoles from "./helpers/build/empty-consoles.helper.js";
import COUNTRY_PRIORITY_LIST from "./constants/country-priority-list.constant.js";
import addRomsToConsole from "./helpers/add-roms-to-console.helper.js";
import LANGUAGE_PRIORITY_LIST from "./constants/language-priority-list.constant.js";
import { BIOS_TITLE_SEGMENT } from "./constants/title-segments.constnats.js";
import printConsoleDuplicates from "./helpers/print-console-duplicates.helper.js";
import printFinalConsolesReport from "./helpers/print-final-consoles-report.helper.js";
import writeConsoleFiles from "./helpers/write-console-files.helper.js";
import groupsFromConsoleName from "./helpers/build/groups-from-console-name.helper.js";
import unselect from "./helpers/unselect/index.js";

const main = async () => {
  const consoles = emptyConsoles();

  for (const [name, konsole] of consoles) {
    const groups = await groupsFromConsoleName(name);

    for (const [title, roms] of groups) {
      const titleIsBios = title.includes(BIOS_TITLE_SEGMENT);
      const keepSelected = 1;

      if (!titleIsBios) {
        unselect.byCountry(roms, COUNTRY_PRIORITY_LIST);
        unselect.byLanguages(roms, LANGUAGE_PRIORITY_LIST);
        unselect.byLanguageAmount(roms);
      }
      unselect.bySpecialFlags(roms);
      unselect.byBannedLabelSegments(roms, ["Disk"]);
      unselect.byVersionsPriorityList(roms);
      if (!titleIsBios) {
        unselect.byPALAndNTSCLabels(roms);
        unselect.byBannedLabelsBasePriorityList(roms);
        unselect.byWhitelistedLabelsBasePriorityList(roms);
      }

      addRomsToConsole(roms, konsole, title);
    }
  }

  for (const [_, konsole] of consoles) printConsoleDuplicates(konsole);
  printFinalConsolesReport(consoles);

  const generateFiles = false;
  if (generateFiles)
    for (const [name, konsole] of consoles) writeConsoleFiles(name, konsole);
};

main();
