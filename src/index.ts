import { readdir } from "node:fs/promises";
import path from "path";

import type { Groups, Consoles } from "./types.js";
import unselectByCountry from "./unselect-by-country.js";
import unselectByUnwanted from "./unselect-by-unwanted.js";
import selectByVersion from "./select-by-version.js";
import unselectPAL from "./unselect-pal.js";
import selectByVersionOnNonReleasedGames from "./select-by-version-on-non-released-games.js";

const CONSOLE_NAMES = [
  "atari2600",
  "atari7800",
  "gamegear",
  "gb",
  "gba",
  "gbc",
  "mastersystem",
  "nes",
  "snes",
];

const consoles: Consoles = {};

for (const name of CONSOLE_NAMES) {
  consoles[name] = {
    roms: {
      selected: {
        none: {},
        one: {},
        multiple: {},
      },
    },
  };
}

const dirBasePath = "/home/alejandro/Downloads/myrient";

const main = async () => {
  for (const [name, konsole] of Object.entries(consoles)) {
    const dirPath = path.join(dirBasePath, name);

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

    for (const [title, roms] of Object.entries(groups)) {
      // if there is only one entry in the ROM group, skip
      if (roms.length === 1) {
        konsole.roms.selected.one[title] = roms;
        continue;
      }

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
        /(Rev [0-9]+)|(R[0-9]+)/,
        (label1, label2) => {
          const num1 = +label1.replace(/Rev /, "").replace(/R/, "");
          const num2 = +label2.replace(/Rev /, "").replace(/R/, "");
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

      selectByVersionOnNonReleasedGames(roms, ["Proto", "Demo", "Beta"]);

      const romsSelected = roms.reduce((acc, rom) => {
        if (rom.selected) acc++;
        return acc;
      }, 0);

      if (romsSelected === 0) konsole.roms.selected.none[title] = roms;
      else if (romsSelected > 1) konsole.roms.selected.multiple[title] = roms;
      else konsole.roms.selected.one[title] = roms;
    }
  }

  let totalNoneSelected = 0;
  let totalOneSelected = 0;
  let totalMultipleSelected = 0;

  for (const [name, konsole] of Object.entries(consoles)) {
    console.log(`===== Report for console ${name} =====`);

    const noneSelected = Object.keys(konsole.roms.selected.none).length;
    const oneSelected = Object.keys(konsole.roms.selected.one).length;
    const multipleSelected = Object.keys(konsole.roms.selected.multiple).length;

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
};

main();
