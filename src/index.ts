import { readdir } from "node:fs/promises";
import path from "path";

import type { Groups, DuplicatesData, Rom } from "./types.js";
import selectByVersion from "./select-by-version.js";
import buildEmptyConsolesObject from "./helpers/build-empty-consoles-object.helper.js";
import DIR_BASE_PATH from "./constants/dir-base-path.constant.js";
import buildGroupsFromFilenames from "./helpers/build-groups-from-filenames.helper.js";
import getSpecialFlagsFromRomSet from "./helpers/get-special-flags-from-rom-set.helper.js";
import pickRomsBasedOnCountryList from "./helpers/pick-roms-based-on-country-list.helper.js";
import COUNTRY_LIST from "./constants/country-list.constant.js";
import discardRomsBasedOnUnwantedLabelList from "./helpers/discard-roms-based-on-unwanted-label-list.helper.js";

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

      let versionLabelFound = selectByVersion(
        roms,
        /^[vV]([0-9]+\.*)+$/,
        (label1, label2) => {
          const nums1 = label1
            .substring(1)
            .split(".")
            .map((n) => +n);
          const nums2 = label2
            .substring(1)
            .split(".")
            .map((n) => +n);

          const shortestNumsList = nums1.length < nums2.length ? nums1 : nums2;
          const lengthDiff = Math.abs(nums1.length - nums2.length);
          [...Array(lengthDiff)]
            .fill(undefined)
            .forEach((_) => shortestNumsList.push(0));

          for (const [index, num1] of nums1.entries()) {
            const num2 = nums2[index] || -1;
            if (num1 > num2) return 1;
            else if (num1 < num2) return -1;
          }
          return 0;
        },
        countryLabel,
      );
      versionLabelFound = selectByVersion(
        roms,
        /(Rev [0-9]+)|(R[0-9]+)/,
        (label1, label2) => {
          const num1 = +label1.replace(/Rev /, "").replace(/R/, "");
          const num2 = +label2.replace(/Rev /, "").replace(/R/, "");
          if (num1 > num2) return 1;
          else if (num1 < num2) return -1;
          else return 0;
        },
        countryLabel,
        versionLabelFound,
      );
      versionLabelFound = selectByVersion(
        roms,
        /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/,
        (label1, label2) => {
          const nums1 = label1.split("-");
          const nums2 = label2.split("-");

          for (const [index, num1] of nums1.entries()) {
            const num2 = nums2[index] || -1;
            if (num1 > num2) return 1;
            else if (num1 < num2) return -1;
          }
          return 0;
        },
        countryLabel,
        versionLabelFound,
      );
      versionLabelFound = selectByVersion(
        roms,
        /^REV-[A-Z]$/,
        (label1, label2) => {
          const num1 = label1.replace(/REV-/, "").charCodeAt(0);
          const num2 = label2.replace(/REV-/, "").charCodeAt(0);
          if (num1 > num2) return 1;
          else if (num1 < num2) return -1;
          else return 0;
        },
        countryLabel,
        versionLabelFound,
      );
      versionLabelFound = selectByVersion(
        roms,
        /^Rev [A-Z]$/,
        (label1, label2) => {
          const num1 = label1.replace(/Rev /, "").charCodeAt(0);
          const num2 = label2.replace(/Rev /, "").charCodeAt(0);
          if (num1 > num2) return 1;
          else if (num1 < num2) return -1;
          else return 0;
        },
        countryLabel,
        versionLabelFound,
      );
      versionLabelFound = selectByVersion(
        roms,
        /^[A-Z]$/,
        (label1, label2) => {
          const num1 = label1.replace(/[A-Z] /, "").charCodeAt(0);
          const num2 = label2.replace(/[A-Z] /, "").charCodeAt(0);
          if (num1 > num2) return 1;
          else if (num1 < num2) return -1;
          else return 0;
        },
        countryLabel,
        versionLabelFound,
      );
      versionLabelFound = selectByVersion(
        roms,
        /^[0-9]+$/,
        (label1, label2) => {
          const num1 = +label1;
          const num2 = +label2;
          if (num1 > num2) return 1;
          else if (num1 < num2) return -1;
          else return 0;
        },
        countryLabel,
        versionLabelFound,
      );
      versionLabelFound = selectByVersion(
        roms,
        /^4B-[0-9]+(, [\w-]*)$/,
        (label1, label2) => {
          const num1 = +label1.split(",")[0]!.replace(/4B-/, "");
          const num2 = +label2.split(",")[0]!.replace(/4B-/, "");
          if (num1 > num2) return 1;
          else if (num1 < num2) return -1;
          else return 0;
        },
        countryLabel,
        versionLabelFound,
      );
      versionLabelFound = selectByVersion(
        roms,
        /^KG-[0-9]+$/,
        (label1, label2) => {
          const num1 = +label1.split(",")[0]!.replace(/KG-/, "");
          const num2 = +label2.split(",")[0]!.replace(/KG-/, "");
          if (num1 > num2) return 1;
          else if (num1 < num2) return -1;
          else return 0;
        },
        countryLabel,
        versionLabelFound,
      );
      versionLabelFound = selectByVersion(
        roms,
        /^HH-[0-9]+$/,
        (label1, label2) => {
          const num1 = +label1.split(",")[0]!.replace(/HH-/, "");
          const num2 = +label2.split(",")[0]!.replace(/HH-/, "");
          if (num1 > num2) return 1;
          else if (num1 < num2) return -1;
          else return 0;
        },
        countryLabel,
        versionLabelFound,
      );
      versionLabelFound = selectByVersion(
        roms,
        /^FS[0-9]+$/,
        (label1, label2) => {
          const num1 = +label1.split(",")[0]!.replace(/FS/, "");
          const num2 = +label2.split(",")[0]!.replace(/FS/, "");
          if (num1 > num2) return 1;
          else if (num1 < num2) return -1;
          else return 0;
        },
        countryLabel,
        versionLabelFound,
      );
      versionLabelFound = selectByVersion(
        roms,
        /^[0-9]+ Fighters$/,
        (label1, label2) => {
          const num1 = +label1.split(",")[0]!.replace(/ Fighters/, "");
          const num2 = +label2.split(",")[0]!.replace(/ Fighters/, "");
          if (num1 > num2) return 1;
          else if (num1 < num2) return -1;
          else return 0;
        },
        countryLabel,
        versionLabelFound,
      );
      versionLabelFound = selectByVersion(
        roms,
        /^[0-9]+ People$/,
        (label1, label2) => {
          const num1 = +label1.split(",")[0]!.replace(/ People/, "");
          const num2 = +label2.split(",")[0]!.replace(/ People/, "");
          if (num1 > num2) return 1;
          else if (num1 < num2) return -1;
          else return 0;
        },
        countryLabel,
        versionLabelFound,
      );
      versionLabelFound = selectByVersion(
        roms,
        /^DS-H[0-9]+$/,
        (label1, label2) => {
          const num1 = +label1.split(",")[0]!.replace(/DS-H/, "");
          const num2 = +label2.split(",")[0]!.replace(/DS-H/, "");
          if (num1 > num2) return 1;
          else if (num1 < num2) return -1;
          else return 0;
        },
        countryLabel,
        versionLabelFound,
      );
      versionLabelFound = selectByVersion(
        roms,
        /^NROM [0-9]+$/,
        (label1, label2) => {
          const num1 = +label1.split(",")[0]!.replace(/NROM /, "");
          const num2 = +label2.split(",")[0]!.replace(/NROM /, "");
          if (num1 > num2) return 1;
          else if (num1 < num2) return -1;
          else return 0;
        },
        countryLabel,
        versionLabelFound,
      );

      if (specialFlags.allRomsAreUnreleased) {
        versionLabelFound = selectByVersion(
          roms,
          /^Beta( [0-9]+)?$/,
          (label1, label2) => {
            const num1 = label1.replace(/Beta/, "").trim() || 0;
            const num2 = label2.replace(/Beta/, "").trim() || 0;
            if (num1 > num2) return 1;
            else if (num1 < num2) return -1;
            else return 0;
          },
          countryLabel,
          versionLabelFound,
        );
        versionLabelFound = selectByVersion(
          roms,
          /^Proto( [0-9]+)?$/,
          (label1, label2) => {
            const num1 = label1.replace(/Proto/, "").trim() || 0;
            const num2 = label2.replace(/Proto/, "").trim() || 0;
            if (num1 > num2) return 1;
            else if (num1 < num2) return -1;
            else return 0;
          },
          countryLabel,
          versionLabelFound,
        );
        versionLabelFound = selectByVersion(
          roms,
          /^Demo( [0-9]+)?$/,
          (label1, label2) => {
            const num1 = label1.replace(/Demo/, "").trim() || 0;
            const num2 = label2.replace(/Demo/, "").trim() || 0;
            if (num1 > num2) return 1;
            else if (num1 < num2) return -1;
            else return 0;
          },
          countryLabel,
          versionLabelFound,
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
