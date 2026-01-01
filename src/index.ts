import buildEmptyConsolesObject from "./helpers/build-empty-consoles-object.helper.js";
import unselectByCountry from "./helpers/unselect/unselect-by-country.helper.js";
import COUNTRY_PRIORITY_LIST from "./constants/country-priority-list.constant.js";
import unselectByVersionsPriorityList from "./helpers/unselect/unselect-by-versions-priority-list.helper.js";
import addRomsToConsole from "./helpers/add-roms-to-console.helper.js";
import unselectByLanguages from "./helpers/unselect/unselect-by-languages.helper.js";
import LANGUAGE_PRIORITY_LIST from "./constants/language-priority-list.constant.js";
import unselectByPALAndNTSCLabels from "./helpers/unselect/unselect-by-pal-and-ntsc-labels.helper.js";
import unselectBySpecialFlags from "./helpers/unselect/unselect-by-special-flags.helper.js";
import unselectByBannedLabelsBasePriorityList from "./helpers/unselect/unselect-by-banned-labels-base-priority-list.helper.js";
import unselectByLanguageAmount from "./helpers/unselect/unselect-by-language-amount.helper.js";
import { BIOS_TITLE_SEGMENT } from "./constants/title-segments.constnats.js";
import printConsoleDuplicates from "./helpers/print-console-duplicates.helper.js";
import printFinalConsolesReport from "./helpers/print-final-consoles-report.helper.js";
import writeConsoleFiles from "./helpers/write-console-files.helper.js";
import getGroupsFromConsoleRomsDir from "./helpers/get-groups-from-console-roms-dir.helper.js";
import unselectByBannedLabelSegments from "./helpers/unselect/unselect-by-banned-label-segments.helper.js";
import unselectByWhitelistedLabelsBasePriorityList from "./helpers/unselect/unselect-by-whitelisted-labels-base-priority-list.helper.js";

const main = async () => {
  const consoles = buildEmptyConsolesObject();

  for (const [name, konsole] of consoles) {
    const groups = await getGroupsFromConsoleRomsDir(name);

    for (const [title, roms] of groups) {
      const titleIsBios = title.includes(BIOS_TITLE_SEGMENT);
      const keepSelected = 1;

      if (!titleIsBios) {
        unselectByCountry(roms, COUNTRY_PRIORITY_LIST);
        unselectByLanguages(roms, LANGUAGE_PRIORITY_LIST);
        unselectByLanguageAmount(roms);
      }
      unselectBySpecialFlags(roms);
      unselectByBannedLabelSegments(roms, ["Disk"]);
      unselectByVersionsPriorityList(roms);
      if (!titleIsBios) {
        unselectByPALAndNTSCLabels(roms);
        unselectByBannedLabelsBasePriorityList(roms);
        unselectByWhitelistedLabelsBasePriorityList(roms);
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
