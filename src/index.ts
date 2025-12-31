import buildEmptyConsolesObject from "./helpers/build-empty-consoles-object.helper.js";
import unselectByCountry from "./helpers/unselect-by-country.helper.js";
import COUNTRY_PRIORITY_LIST from "./constants/country-priority-list.constant.js";
import discardRomsBasedOnVersioningSystems from "./helpers/discard-roms-based-on-versioning-systems.helper.js";
import addRomsToConsole from "./helpers/add-roms-to-console.helper.js";
import discardRomsBasedOnLanguageList from "./helpers/discard-roms-based-on-language-list.helper.js";
import LANGUAGE_PRIORITY_LIST from "./constants/language-priority-list.constant.js";
import discardRomsWithPALLabelIfRomsetHasNTSCRoms from "./helpers/discard-roms-with-pal-label-if-romset-has-ntsc-roms.helper.js";
import discardRomsBasedOnUnwantedLabelSegments from "./helpers/discard-roms-based-on-unwanted-label-segments.helper.js";
import discardRomsBasedOnUnwantedExactLabels from "./helpers/discard-roms-based-on-unwanted-exact-labels.helper.js";
import discardRomsBasedOnWantedExactLabels from "./helpers/discard-roms-based-on-wanted-exact-labels.helper.js";
import discardRomsBasedOnLanguageAmount from "./helpers/discard-roms-based-on-language-amount.helper.js";
import { BIOS_TITLE_SEGMENT } from "./constants/title-segments.constnats.js";
import printConsoleDuplicates from "./helpers/print-console-duplicates.helper.js";
import printFinalConsolesReport from "./helpers/print-final-consoles-report.helper.js";
import writeConsoleFiles from "./helpers/write-console-files.helper.js";
import getGroupsFromConsoleRomsDir from "./helpers/get-groups-from-console-roms-dir.helper.js";

const main = async () => {
  const consoles = buildEmptyConsolesObject();

  for (const [name, konsole] of consoles) {
    const groups = await getGroupsFromConsoleRomsDir(name);

    for (const [title, roms] of groups) {
      const titleIsBios = title.includes(BIOS_TITLE_SEGMENT);
      const keepSelected = 1;

      if (!titleIsBios) {
        unselectByCountry(roms, COUNTRY_PRIORITY_LIST);
        discardRomsBasedOnLanguageList(roms, LANGUAGE_PRIORITY_LIST);
        discardRomsBasedOnLanguageAmount(roms);
      }
      discardRomsBasedOnUnwantedLabelSegments(roms);
      discardRomsBasedOnVersioningSystems(roms);
      if (!titleIsBios) {
        discardRomsWithPALLabelIfRomsetHasNTSCRoms(roms);
        discardRomsBasedOnUnwantedExactLabels(roms);
        discardRomsBasedOnWantedExactLabels(roms);
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
