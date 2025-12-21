import { readdir } from "node:fs/promises";
import path from "path";

import type { Groups, Consoles, DuplicatesData } from "./types.js";
import unselectByCountry from "./unselect-by-country.js";
import unselectByUnwanted from "./unselect-by-unwanted.js";
import selectByVersion from "./select-by-version.js";
import unselectPAL from "./unselect-pal.js";

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

      const allRomsAreUnreleased = roms.every((rom) =>
        rom.labels.some(
          (label) =>
            label.includes("Beta") ||
            label.includes("Proto") ||
            label.includes("Demo"),
        ),
      );
      const allRomsAreVirtualConsole = roms.every((rom) =>
        rom.labels.some((label) => label.includes("Virtual Console")),
      );

      // country priorities: USA, World, Europe, Japan
      let [countryLabelFound, countryLabel] = unselectByCountry(
        roms,
        "USA",
        allRomsAreUnreleased,
      );
      if (!countryLabelFound)
        [countryLabelFound, countryLabel] = unselectByCountry(
          roms,
          "World",
          allRomsAreUnreleased,
        );
      if (!countryLabelFound)
        [countryLabelFound, countryLabel] = unselectByCountry(
          roms,
          "Europe",
          allRomsAreUnreleased,
        );
      if (!countryLabelFound)
        [countryLabelFound, countryLabel] = unselectByCountry(
          roms,
          "Australia",
          allRomsAreUnreleased,
        );
      if (!countryLabelFound)
        [countryLabelFound, countryLabel] = unselectByCountry(
          roms,
          "Japan",
          allRomsAreUnreleased,
        );
      if (!countryLabelFound)
        [countryLabelFound, countryLabel] = unselectByCountry(
          roms,
          "Korea",
          allRomsAreUnreleased,
        );
      if (!countryLabelFound)
        [countryLabelFound, countryLabel] = unselectByCountry(
          roms,
          "Asia",
          allRomsAreUnreleased,
        );
      if (!countryLabelFound)
        [countryLabelFound, countryLabel] = unselectByCountry(
          roms,
          "Taiwan",
          allRomsAreUnreleased,
        );
      if (!countryLabelFound)
        [countryLabelFound, countryLabel] = unselectByCountry(
          roms,
          "China",
          allRomsAreUnreleased,
        );
      if (!countryLabelFound)
        [countryLabelFound, countryLabel] = unselectByCountry(
          roms,
          "Unknown",
          allRomsAreUnreleased,
        );

      const unwantedLabels = [
        "Activision Anthology - Remix Edition",
        "Aleste Collection",
        "Alt",
        "Animal Crossing",
        "Arcade",
        "Batteryless",
        "Capcom Classics Mini Mix",
        "Cowabunga Collection, The",
        "Debug",
        "Easy Version",
        "GameCube",
        "HOT B",
        "Keihin Ban",
        "Muted",
        "No SRAM",
        "Other Control",
        "QUByte Classics",
        "Retro-Bit Generations",
        "Sample",
        "Sega 3D Classics",
        "Seiken Densetsu Collection",
        "Source Code",
        "The Cowabunga Collection",
        "Two Player",
      ];

      if (!allRomsAreUnreleased)
        unwantedLabels.push(...["Beta", "Demo", "Proto"]);
      if (!allRomsAreVirtualConsole) unwantedLabels.push("Virtual Console");

      // unselect ROMs with undesired labels
      unselectByUnwanted(roms, unwantedLabels, countryLabel);

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

      if (allRomsAreUnreleased) {
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

      if (romsSelected === 0) konsole.roms.selected.none[title] = roms;
      else if (romsSelected > 1) konsole.roms.selected.multiple[title] = roms;
      else konsole.roms.selected.one[title] = roms;
    }
  }

  let totalNoneSelected = 0;
  let totalOneSelected = 0;
  let totalMultipleSelected = 0;

  console.log(consoles["gamegear"]!.roms.selected.multiple);
  // for (const [name, konsole] of Object.entries(consoles)) {
  //   console.log(konsole.roms.selected.multiple);
  // }

  for (const [name, konsole] of Object.entries(consoles)) {
    console.log(`===== Report for console ${name} =====`);

    const noneSelected = Object.keys(konsole.roms.selected.none).length;
    const oneSelected = Object.keys(konsole.roms.selected.one).length;
    const multipleSelected = Object.keys(konsole.roms.selected.multiple).length;

    console.log(`ROMs with 0 selections: ${noneSelected}`);
    // console.log(`ROMs with 1 selection: ${oneSelected}`);
    console.log(`ROMs with >1 selections: ${multipleSelected}`);

    totalNoneSelected += noneSelected;
    totalOneSelected += oneSelected;
    totalMultipleSelected += multipleSelected;
  }

  console.log(`===== Global Report =====`);
  console.log(`ROMs with 0 selections: ${totalNoneSelected}`);
  // console.log(`ROMs with 1 selection: ${totalOneSelected}`);
  console.log(`ROMs with >1 selections: ${totalMultipleSelected}`);

  console.log(`===== Duplicates Report =====`);
  const duplicatesData: DuplicatesData = {};
  for (const [name, konsole] of Object.entries(consoles)) {
    for (const [title, roms] of Object.entries(
      konsole.roms.selected.multiple,
    )) {
      const amount = roms.reduce((acc, rom) => {
        if (rom.selected) acc++;
        return acc;
      }, 0);
      if (!duplicatesData[amount]) {
        duplicatesData[amount] = {};
        duplicatesData[amount][title] = roms;
      } else {
        duplicatesData[amount][title] = roms;
      }
    }
  }

  for (const [amount, groups] of Object.entries(duplicatesData)) {
    console.log(
      `ROMs with ${amount} duplicates: ${Object.keys(groups).length}`,
    );
  }
};

main();
