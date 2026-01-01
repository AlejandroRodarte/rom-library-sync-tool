import buildEmptyConsolesObject from "./helpers/build-empty-consoles-object.helper.js";
import byCountry from "./helpers/unselect/by-country.helper.js";
import COUNTRY_PRIORITY_LIST from "./constants/country-priority-list.constant.js";
import byVersionsPriorityList from "./helpers/unselect/by-versions-priority-list.helper.js";
import addRomsToConsole from "./helpers/add-roms-to-console.helper.js";
import byLanguages from "./helpers/unselect/by-languages.helper.js";
import LANGUAGE_PRIORITY_LIST from "./constants/language-priority-list.constant.js";
import byPALAndNTSCLabels from "./helpers/unselect/by-pal-and-ntsc-labels.helper.js";
import bySpecialFlags from "./helpers/unselect/by-special-flags.helper.js";
import byBannedLabelsBasePriorityList from "./helpers/unselect/by-banned-labels-base-priority-list.helper.js";
import byLanguageAmount from "./helpers/unselect/by-language-amount.helper.js";
import { BIOS_TITLE_SEGMENT } from "./constants/title-segments.constnats.js";
import printConsoleDuplicates from "./helpers/print-console-duplicates.helper.js";
import printFinalConsolesReport from "./helpers/print-final-consoles-report.helper.js";
import writeConsoleFiles from "./helpers/write-console-files.helper.js";
import getGroupsFromConsoleRomsDir from "./helpers/get-groups-from-console-roms-dir.helper.js";
import byBannedLabelSegments from "./helpers/unselect/by-banned-label-segments.helper.js";
import byWhitelistedLabelsBasePriorityList from "./helpers/unselect/by-whitelisted-labels-base-priority-list.helper.js";

const main = async () => {
  const consoles = buildEmptyConsolesObject();

  for (const [name, konsole] of consoles) {
    const groups = await getGroupsFromConsoleRomsDir(name);

    for (const [title, roms] of groups) {
      const titleIsBios = title.includes(BIOS_TITLE_SEGMENT);
      const keepSelected = 1;

      if (!titleIsBios) {
        byCountry(roms, COUNTRY_PRIORITY_LIST);
        byLanguages(roms, LANGUAGE_PRIORITY_LIST);
        byLanguageAmount(roms);
      }
      bySpecialFlags(roms);
      byBannedLabelSegments(roms, ["Disk"]);
      byVersionsPriorityList(roms);
      if (!titleIsBios) {
        byPALAndNTSCLabels(roms);
        byBannedLabelsBasePriorityList(roms);
        byWhitelistedLabelsBasePriorityList(roms);
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
