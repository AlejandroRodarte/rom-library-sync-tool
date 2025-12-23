import { readdir } from "node:fs/promises";
import path from "path";

import type { Groups, DuplicatesData, Rom } from "./types.js";
import buildEmptyConsolesObject from "./helpers/build-empty-consoles-object.helper.js";
import DIR_BASE_PATH from "./constants/dir-base-path.constant.js";
import buildGroupsFromFilenames from "./helpers/build-groups-from-filenames.helper.js";
import getSpecialFlagsFromRomSet from "./helpers/get-special-flags-from-rom-set.helper.js";
import pickRomsBasedOnCountryList from "./helpers/pick-roms-based-on-country-list.helper.js";
import COUNTRY_LIST from "./constants/country-list.constant.js";
import discardRomsBasedOnUnwantedLabelList from "./helpers/discard-roms-based-on-unwanted-label-list.helper.js";
import selectRomsBasedOnVersioningSystems from "./helpers/select-roms-based-on-versioning.systems.helper.js";
import VERSIONING_SYSTEMS_BASE_LIST from "./constants/versioning-systems-base-list.constant.js";
import VERSIONING_SYSTEMS_LIST_FOR_UNRELEASED_ROMS from "./constants/versioning-systems-list-for-unreleased-roms.constant.js";
import pickRomWithLeastAmountOfLabels from "./helpers/pick-rom-with-least-amount-of-labels.helper.js";
import addRomsToConsole from "./helpers/add-roms-to-console.helper.js";

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

      const fullRomSetSpecialFlags = getSpecialFlagsFromRomSet(roms);

      const countryLabel = pickRomsBasedOnCountryList(
        roms,
        COUNTRY_LIST,
        fullRomSetSpecialFlags,
      );

      const countryRoms = roms.filter((rom) =>
        rom.labels.includes(countryLabel),
      );

      const countryRomSetSpecialFlags = getSpecialFlagsFromRomSet(countryRoms);

      discardRomsBasedOnUnwantedLabelList(
        roms,
        countryLabel,
        countryRomSetSpecialFlags,
      );

      selectRomsBasedOnVersioningSystems(
        roms,
        VERSIONING_SYSTEMS_BASE_LIST,
        countryLabel,
      );

      if (countryRomSetSpecialFlags.allRomsAreUnreleased) {
        selectRomsBasedOnVersioningSystems(
          roms,
          VERSIONING_SYSTEMS_LIST_FOR_UNRELEASED_ROMS,
          countryLabel,
        );
      }

      pickRomWithLeastAmountOfLabels(roms, countryLabel);
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
