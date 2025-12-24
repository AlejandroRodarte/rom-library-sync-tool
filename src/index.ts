import { readdir } from "node:fs/promises";
import path from "path";

import type {
  Groups,
  DuplicatesData,
  Rom,
  VersionSystem,
  UnwantedLabels,
} from "./types.js";
import buildEmptyConsolesObject from "./helpers/build-empty-consoles-object.helper.js";
import DIR_BASE_PATH from "./constants/dir-base-path.constant.js";
import buildGroupsFromFilenames from "./helpers/build-groups-from-filenames.helper.js";
import getSpecialFlagsFromRomSet from "./helpers/get-special-flags-from-rom-set.helper.js";
import discardRomsBasedOnCountryList from "./helpers/discard-roms-based-on-country-list.helper.js";
import COUNTRY_LIST from "./constants/country-list.constant.js";
import discardRomsBasedOnUnwantedLabels from "./helpers/discard-roms-based-on-unwanted-labels.helper.js";
import discardRomsBasedOnVersioningSystems from "./helpers/discard-roms-based-on-versioning.systems.helper.js";
import VERSIONING_SYSTEMS_BASE_LIST from "./constants/versioning-systems-base-list.constant.js";
import VERSIONING_SYSTEMS_LIST_FOR_UNRELEASED_ROMS from "./constants/versioning-systems-list-for-unreleased-roms.constant.js";
import discardRomsBasedOnLabelAmount from "./helpers/discard-roms-based-on-label-amount.helper.js";
import addRomsToConsole from "./helpers/add-roms-to-console.helper.js";
import discardRomsBasedOnLanguageList from "./helpers/discard-roms-based-on-language-list.helper.js";
import LANGUAGE_LIST from "./constants/language-list.constant.js";
import UNWANTED_EXACT_LABELS_BASE_LIST from "./constants/unwanted-exact-labels-base-list.constant.js";
import UNRELEASED_LABELS from "./constants/unreleased-labels.constant.js";
import VIRTUAL_CONSOLE_LABEL from "./constants/virtual-console-label.constant.js";
import discardRomsWithPALLabelIfRomsetHasNTSCRoms from "./helpers/discard-roms-with-pal-label-if-romset-has-ntsc-roms.helper.js";
import discardRomsBasedOnUnwantedLabelSegments from "./helpers/discard-roms-based-on-unwanted-label-segments.helper.js";

const main = async () => {
  const consoles = buildEmptyConsolesObject();

  for (const [name, konsole] of consoles) {
    const dirPath = path.join(DIR_BASE_PATH, name);

    // NOTE: output already sorts filenames in ascending order
    const filenames = await readdir(dirPath);
    const groups = buildGroupsFromFilenames(filenames);

    for (const [title, roms] of groups) {
      // if there is only one entry in the ROM group, skip
      if (roms.length === 1) {
        konsole.roms.selected.one.set(title, roms);
        continue;
      }

      let selectedRoms: Rom[] = roms;

      discardRomsBasedOnCountryList(selectedRoms, COUNTRY_LIST);
      selectedRoms = roms.filter((rom) => rom.selected);

      const selectedRomsWithLanguages = selectedRoms.filter(
        (rom) => rom.languages.length > 0,
      );
      discardRomsBasedOnLanguageList(selectedRomsWithLanguages, LANGUAGE_LIST);
      selectedRoms = roms.filter((rom) => rom.selected);
      let specialFlags = getSpecialFlagsFromRomSet(selectedRoms);

      const unwantedLabelSegments: string[] = [];
      if (!specialFlags.allRomsAreUnreleased)
        unwantedLabelSegments.push(...UNRELEASED_LABELS);
      if (!specialFlags.allRomsAreForVirtualConsole)
        unwantedLabelSegments.push(VIRTUAL_CONSOLE_LABEL);

      discardRomsBasedOnUnwantedLabelSegments(
        selectedRoms,
        unwantedLabelSegments,
      );
      selectedRoms = roms.filter((rom) => rom.selected);
      specialFlags = getSpecialFlagsFromRomSet(selectedRoms);

      const versionSystems: VersionSystem[] = [];
      if (specialFlags.allRomsAreUnreleased)
        versionSystems.push(...VERSIONING_SYSTEMS_LIST_FOR_UNRELEASED_ROMS);
      versionSystems.push(...VERSIONING_SYSTEMS_BASE_LIST);

      discardRomsBasedOnVersioningSystems(selectedRoms, versionSystems);
      selectedRoms = roms.filter((rom) => rom.selected);

      discardRomsWithPALLabelIfRomsetHasNTSCRoms(selectedRoms);
      selectedRoms = roms.filter((rom) => rom.selected);

      const unwantedLabels: UnwantedLabels = { includes: [], exact: [] };
      unwantedLabels.exact = [...UNWANTED_EXACT_LABELS_BASE_LIST];

      discardRomsBasedOnUnwantedLabels(selectedRoms, unwantedLabels);
      unwantedLabels.exact.length = 0;
      selectedRoms = roms.filter((rom) => rom.selected);

      // discardRomsBasedOnLabelAmount(selectedRoms);
      // selectedRoms = roms.filter((rom) => rom.selected);

      addRomsToConsole(roms, konsole, title);
    }
  }

  let totalNoneSelected = 0;
  let totalOneSelected = 0;
  let totalMultipleSelected = 0;

  for (const [_, konsole] of consoles) {
    console.log(konsole.roms.selected.multiple);
  }

  for (const [name, konsole] of consoles) {
    console.log(`===== Report for console ${name} =====`);

    const noneSelected = konsole.roms.selected.none.size;
    const oneSelected = konsole.roms.selected.one.size;
    const multipleSelected = konsole.roms.selected.multiple.size;

    console.log(`ROMs with 0 selections: ${noneSelected}`);
    console.log(`ROMs with 1 selection: ${oneSelected}`);
    console.log(`ROMs with >1 selections: ${multipleSelected}`);

    totalNoneSelected += noneSelected;
    totalOneSelected += oneSelected;
    totalMultipleSelected += multipleSelected;
  }

  console.log(`===== Global Report =====`);
  console.log(`ROMs with 0 selections: ${totalNoneSelected}`);
  console.log(`ROMs with 1 selection: ${totalOneSelected}`);
  console.log(`ROMs with >1 selections: ${totalMultipleSelected}`);

  console.log(`===== Duplicates Report =====`);
  const duplicatesData: DuplicatesData = new Map<number, Groups>();
  for (const [_, konsole] of consoles) {
    for (const [title, roms] of konsole.roms.selected.multiple) {
      const amount = roms.reduce((acc, rom) => {
        if (rom.selected) acc++;
        return acc;
      }, 0);
      const amountData = duplicatesData.get(amount);
      if (amountData) amountData.set(title, roms);
      else duplicatesData.set(amount, new Map<string, Rom[]>([[title, roms]]));
    }
  }

  for (const [amount, groups] of duplicatesData) {
    console.log(`ROMs with ${amount} duplicates: ${groups.size}`);
  }
};

main();
