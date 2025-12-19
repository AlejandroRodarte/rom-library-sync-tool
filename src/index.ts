import { readdir } from "node:fs/promises";
import type { Groups } from "./types.js";
import unselectByCountry from "./unselect-by-country.js";
import unselectByUnwanted from "./unselect-by-unwanted.js";
import selectByVersion from "./select-by-version.js";
import unselectPAL from "./unselect-pal.js";

const CONSOLE_NAME = "gamegear";
const dirPath = `/home/alejandro/Downloads/myrient/${CONSOLE_NAME}`;

const main = async () => {
  // NOTE: output already sorts filenames in ascending order
  const filenames = await readdir(dirPath);

  const groups: Groups = {};
  let previousTitle = "";

  for (const filename of filenames) {
    // EXAMPLE
    // rom: Super Space Invaders (USA, Europe).zip
    // title: Super Space Invaders
    const [title] = filename.split("(");

    if (!title) {
      console.error(`No title found for ROM ${filename}`);
      continue;
    }

    const labels: string[] = [];
    const labelsRegexp = /\((.*?)\)/g;
    const matches = filename.matchAll(labelsRegexp);
    for (const match of matches) {
      const [, label] = match;
      if (label) labels.push(label);
    }

    // group ROMs by title
    if (title === previousTitle) {
      const group = groups[title];
      if (group) group.push({ filename, labels, selected: true });
    } else {
      groups[title] = [{ filename, labels, selected: true }];
    }

    previousTitle = title;
  }

  for (const [_, roms] of Object.entries(groups)) {
    // if there is only one entry in the ROM group, skip
    if (roms.length === 1) continue;

    // unselect ROMs with undesired labels
    unselectByUnwanted(roms, [
      "Beta",
      "Demo",
      "Muted",
      "Proto",
      "Sample",
      "Source Code",
      "Two Player",
      "Virtual Console",
    ]);

    // prioritize USA ROMs
    let countryLabelFound = unselectByCountry(roms, "USA");
    // if USA ROM is not found, try to find a World ROM
    countryLabelFound = unselectByCountry(roms, "World", countryLabelFound);
    // if World ROM is not found, try to find a Europe ROM
    countryLabelFound = unselectByCountry(roms, "Europe", countryLabelFound);
    // if Europe ROM is not found, try to find a Japan ROM
    countryLabelFound = unselectByCountry(roms, "Japan", countryLabelFound);

    unselectPAL(roms);

    let versionLabelFound = selectByVersion(
      roms,
      /^v[0-9]+\.[0-9]+$/,
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
    );
    versionLabelFound = selectByVersion(
      roms,
      /((Demo|Proto|Rev) [0-9])|(R[0-9]+)/,
      (label1, label2) => {
        const num1 = +label1.replace(/(Demo|Proto|Rev) /, "").replace(/R/, "");
        const num2 = +label2.replace(/(Demo|Proto|Rev) /, "").replace(/R/, "");
        if (num1 > num2) return 1;
        else if (num1 < num2) return -1;
        else return 0;
      },
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
      versionLabelFound,
    );
  }

  let zeroSelectedRomsCount = 0;
  let moreThanOneSelectedRomCount = 0;
  let oneSelectedRomCount = 0;

  for (const [title, roms] of Object.entries(groups)) {
    let selectedCount = 0;

    for (const rom of roms) {
      if (rom.selected) selectedCount++;
    }

    if (selectedCount === 0) {
      console.log("---------");
      zeroSelectedRomsCount++;
      console.log(`ROM title ${title} has 0 selected ROMs. Printing group.`);
      console.log(roms);
    } else if (selectedCount > 1) {
      console.log("---------");
      moreThanOneSelectedRomCount++;
      console.log(
        `ROM title ${title} has more than 1 selected ROMs. Printing group.`,
      );
      console.log(roms);
    } else oneSelectedRomCount++;
  }

  console.log(`There is a total of ${Object.keys(groups).length} ROM titles.`);
  console.log(
    `There are ${oneSelectedRomCount} ROM titles with only one ROM selected.`,
  );
  console.log(
    `There are ${moreThanOneSelectedRomCount} ROM titles with more than one ROM selected.`,
  );
  console.log(
    `There are ${zeroSelectedRomsCount} ROM titles with zero ROMs selected.`,
  );
};

main();
