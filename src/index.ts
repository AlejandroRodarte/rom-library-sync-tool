import { readdir } from "node:fs/promises";
import path from "path";

import buildEmptyConsolesObject from "./helpers/build-empty-consoles-object.helper.js";
import { ROMS_DIR_PATH } from "./constants/paths.constants.js";
import buildGroupsFromFilenames from "./helpers/build-groups-from-filenames.helper.js";
import discardRomsBasedOnCountryList from "./helpers/discard-roms-based-on-country-list.helper.js";
import COUNTRY_LIST from "./constants/country-list.constant.js";
import discardRomsBasedOnVersioningSystems from "./helpers/discard-roms-based-on-versioning-systems.helper.js";
import addRomsToConsole from "./helpers/add-roms-to-console.helper.js";
import discardRomsBasedOnLanguageList from "./helpers/discard-roms-based-on-language-list.helper.js";
import LANGUAGE_LIST from "./constants/language-list.constant.js";
import discardRomsWithPALLabelIfRomsetHasNTSCRoms from "./helpers/discard-roms-with-pal-label-if-romset-has-ntsc-roms.helper.js";
import discardRomsBasedOnUnwantedLabelSegments from "./helpers/discard-roms-based-on-unwanted-label-segments.helper.js";
import discardRomsBasedOnUnwantedExactLabels from "./helpers/discard-roms-based-on-unwanted-exact-labels.helper.js";
import discardRomsBasedOnWantedExactLabels from "./helpers/discard-roms-based-on-wanted-exact-labels.helper.js";
import discardRomsBasedOnLanguageAmount from "./helpers/discard-roms-based-on-language-amount.helper.js";
import { BIOS_TITLE_SEGMENT } from "./constants/title-segments.constnats.js";
import printConsoleDuplicates from "./helpers/print-console-duplicates.helper.js";
import printFinalConsolesReport from "./helpers/print-final-consoles-report.helper.js";
import writeConsoleFiles from "./helpers/write-console-files.helper.js";

const main = async () => {
  const consoles = buildEmptyConsolesObject();
  for (const [name, konsole] of consoles) {
    const consoleRomsDirPath = path.resolve(ROMS_DIR_PATH, name);

    // NOTE: output already sorts filenames in ascending order
    const entries = await readdir(consoleRomsDirPath, { withFileTypes: true });
    const filenames = entries
      .filter((entry) => entry.isFile())
      .map((e) => e.name);
    const groups = buildGroupsFromFilenames(filenames);

    for (const [title, roms] of groups) {
      if (title === "metadata.txt" || title === "systeminfo.txt") continue;

      // if there is only one entry in the ROM group, skip
      if (roms.length === 1) {
        konsole.roms.selected.one.set(title, roms);
        continue;
      }

      const titleIsBios = title.includes(BIOS_TITLE_SEGMENT);

      if (!titleIsBios) {
        discardRomsBasedOnCountryList(roms, COUNTRY_LIST);
        discardRomsBasedOnLanguageList(roms, LANGUAGE_LIST);
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

  for (const [name, konsole] of consoles) writeConsoleFiles(name, konsole);
};

main();
