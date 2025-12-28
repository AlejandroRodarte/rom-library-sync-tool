import { readdir } from "node:fs/promises";
import path from "path";
import os from "node:os";

import buildEmptyConsolesObject from "./helpers/build-empty-consoles-object.helper.js";
import DIR_BASE_PATH from "./constants/dir-base-path.constant.js";
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
import {
  closeSync,
  existsSync,
  openSync,
  readFileSync,
  truncateSync,
  unlinkSync,
  writeSync,
} from "node:fs";
import getSelectedRomFilenamesFromConsole from "./helpers/get-selected-rom-filenames-from-console.helper.js";

const main = async () => {
  const consoles = buildEmptyConsolesObject();
  for (const [name, konsole] of consoles) {
    const dirPath = path.join(DIR_BASE_PATH, name);

    // NOTE: output already sorts filenames in ascending order
    const filenames = await readdir(dirPath);
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

  for (const [_, konsole] of consoles) {
    printConsoleDuplicates(konsole);
  }
  printFinalConsolesReport(consoles);

  const appDir = process.env.PWD;
  if (!appDir) return;

  const dataDir = path.resolve(appDir, "data");

  for (const [name, konsole] of consoles) {
    const newConsoleFilenames = getSelectedRomFilenamesFromConsole(konsole);

    const consoleFilePath = path.resolve(dataDir, `${name}.txt`);
    const diffConsoleFilePath = path.resolve(dataDir, `${name}.diff.txt`);

    const consoleFileExists = existsSync(consoleFilePath);
    const diffConsoleFileExists = existsSync(diffConsoleFilePath);

    if (diffConsoleFileExists) {
      unlinkSync(diffConsoleFilePath);
    }

    if (!consoleFileExists) {
      const consoleFileDescriptor = openSync(consoleFilePath, "w");

      let content = "";
      for (const [index, filename] of newConsoleFilenames.entries()) {
        const lastItem = index === newConsoleFilenames.length - 1;
        if (!lastItem) content += `${filename}\n`;
        else content += filename;
      }

      writeSync(consoleFileDescriptor, content, null, "utf8");
      closeSync(consoleFileDescriptor);
      continue;
    }

    const currentConsoleFilenames = readFileSync(consoleFilePath)
      .toString()
      .split(os.EOL);
    truncateSync(consoleFilePath);

    const consoleFileDescriptor = openSync(consoleFilePath, "w");

    let content = "";
    for (const [index, filename] of newConsoleFilenames.entries()) {
      const lastItem = index === newConsoleFilenames.length - 1;
      if (!lastItem) content += `${filename}\n`;
      else content += filename;
    }

    writeSync(consoleFileDescriptor, content, null, "utf8");
    closeSync(consoleFileDescriptor);

    const diffConsoleFileDescriptor = openSync(diffConsoleFilePath, "w");

    for (const newConsoleFilename of newConsoleFilenames) {
      const indexWhereNewFilenameIsOnCurrentList =
        currentConsoleFilenames.findIndex((f) => f === newConsoleFilename);
      const newFilenameIsOnCurrentList =
        indexWhereNewFilenameIsOnCurrentList !== -1;

      if (newFilenameIsOnCurrentList) {
        currentConsoleFilenames.splice(indexWhereNewFilenameIsOnCurrentList, 1);
        continue;
      }

      writeSync(
        diffConsoleFileDescriptor,
        `add-file "${DIR_BASE_PATH}/${newConsoleFilename}"\n`,
        null,
        "utf8",
      );
    }

    for (const currentConsoleFilename of currentConsoleFilenames) {
      writeSync(
        diffConsoleFileDescriptor,
        `remove-file "${DIR_BASE_PATH}/${currentConsoleFilename}"\n`,
        null,
        "utf8",
      );
    }

    closeSync(diffConsoleFileDescriptor);
  }
};

main();
