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
import vVersioning from "./objects/version-systems/v-versioning.object.js";
import revNumberVersioning from "./objects/version-systems/rev-number-versioning.object.js";
import rNumberVersioning from "./objects/version-systems/r-number-versioning.object.js";
import dateVersioning from "./objects/version-systems/date-versioning.object.js";
import revLetterVersioning from "./objects/version-systems/rev-letter-versioning.object.js";
import revUppercasedLetterVersioning from "./objects/version-systems/rev-uppercased-letter-versioning.object.js";
import letterVersioning from "./objects/version-systems/letter-versioning.object.js";
import numberVersioning from "./objects/version-systems/number-versioning.object.js";
import fourBVersioning from "./objects/version-systems/4b-versioning.object.js";
import kgVersioning from "./objects/version-systems/kg-versioning.object.js";
import hhVersioning from "./objects/version-systems/hh-versioning.object.js";
import fsVersioning from "./objects/version-systems/fs-versioning.object.js";
import fightersVersioning from "./objects/version-systems/fighters-versioning.object.js";
import peopleVersioning from "./objects/version-systems/people-versioning.object.js";
import dshVersioning from "./objects/version-systems/ds-h-versioning.object.js";
import nromVersioning from "./objects/version-systems/nrom-versioning.object.js";
import betaVersioning from "./objects/version-systems/beta-versioning.object.js";
import protoVersioning from "./objects/version-systems/proto-versioning.object.js";
import demoVersioning from "./objects/version-systems/demo-versioning-object.js";

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

      const specialFlags = getSpecialFlagsFromRomSet(roms);

      const countryLabel = pickRomsBasedOnCountryList(
        roms,
        COUNTRY_LIST,
        specialFlags.allRomsAreUnreleased,
      );

      discardRomsBasedOnUnwantedLabelList(roms, countryLabel, specialFlags);

      selectRomsBasedOnVersioningSystems(
        roms,
        [
          vVersioning,
          revNumberVersioning,
          rNumberVersioning,
          dateVersioning,
          revUppercasedLetterVersioning,
          revLetterVersioning,
          letterVersioning,
          numberVersioning,
          fourBVersioning,
          kgVersioning,
          hhVersioning,
          fsVersioning,
          fightersVersioning,
          peopleVersioning,
          dshVersioning,
          nromVersioning,
        ],
        countryLabel,
      );

      if (specialFlags.allRomsAreUnreleased) {
        selectRomsBasedOnVersioningSystems(
          roms,
          [betaVersioning, protoVersioning, demoVersioning],
          countryLabel,
        );
      }

      const countryRomsSelected = roms.filter((rom) => {
        const hasCountryLabel = rom.labels.some((label) =>
          label.includes(countryLabel),
        );
        const isSelected = rom.selected;
        return hasCountryLabel && isSelected;
      });

      if (countryRomsSelected.length > 1) {
        let minLabelAmount = -1;
        const firstRom = countryRomsSelected[0];
        if (firstRom) minLabelAmount = firstRom.labels.length;

        for (let index = 1; index < countryRomsSelected.length; index++) {
          const rom = countryRomsSelected[index];
          if (rom) {
            const labelAmount = rom.labels.length;
            if (labelAmount < minLabelAmount) minLabelAmount = labelAmount;
          }
        }

        countryRomsSelected.forEach((rom) => {
          if (rom.labels.length > minLabelAmount) rom.selected = false;
        });
      }

      const romsSelected = roms.reduce((acc, rom) => {
        if (rom.selected) acc++;
        return acc;
      }, 0);

      if (romsSelected === 0) konsole.roms.selected.none.set(title, roms);
      else if (romsSelected > 1)
        konsole.roms.selected.multiple.set(title, roms);
      else konsole.roms.selected.one.set(title, roms);
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
