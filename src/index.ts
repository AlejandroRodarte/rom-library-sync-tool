import { readdir } from "node:fs/promises";

interface Rom {
  filename: string;
  labels: string[];
  selected: boolean;
}

type Groups = {
  [title: string]: Rom[];
};

const dirPath = "/home/alejandro/Downloads/myrient/gamegear";

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

    // unselect all ROMs that have any of the following labels on them: `Beta`, `Virtual Console`, `Rev X`
    for (const rom of roms) {
      let romHasUnwantedLabel = false;
      for (const label of rom.labels) {
        if (
          label.includes("Beta") ||
          label.includes("Virtual Console") ||
          label.includes("Rev") ||
          label.includes("Demo") ||
          label.includes("Sample")
        ) {
          romHasUnwantedLabel = true;
          break;
        }
      }
      if (romHasUnwantedLabel) rom.selected = false;
    }

    // check if any ROM in a group has USA in its labels
    let groupHasUSALabel = false;

    for (const rom of roms) {
      for (const label of rom.labels) {
        if (label.includes("USA")) {
          groupHasUSALabel = true;
          break;
        }
      }
      if (groupHasUSALabel) break;
    }

    if (groupHasUSALabel) {
      // unselect all ROMS that do NOT have a USA in its labels
      for (const rom of roms) {
        let romHasUSALabel = false;
        for (const label of rom.labels) {
          if (label.includes("USA")) {
            romHasUSALabel = true;
            break;
          }
        }
        if (!romHasUSALabel) rom.selected = false;
      }
      continue;
    }

    // check if any ROM in a group has Europe in its labels
    let groupHasEuropeLabel = false;

    for (const rom of roms) {
      for (const label of rom.labels) {
        if (label.includes("Europe")) {
          groupHasEuropeLabel = true;
          break;
        }
      }
      if (groupHasEuropeLabel) break;
    }

    if (groupHasEuropeLabel) {
      // unselect all ROMS that do NOT have a Europe in its labels
      for (const rom of roms) {
        let romHasEuropeLabel = false;
        for (const label of rom.labels) {
          if (label.includes("Europe")) {
            romHasEuropeLabel = true;
            break;
          }
        }
        if (!romHasEuropeLabel) rom.selected = false;
      }
      continue;
    }

    // check if any ROM in a group has Japan in its labels
    let groupHasJapanLabel = false;

    for (const rom of roms) {
      for (const label of rom.labels) {
        if (label.includes("Japan")) {
          groupHasJapanLabel = true;
          break;
        }
      }
      if (groupHasJapanLabel) break;
    }

    if (groupHasJapanLabel) {
      // unselect all ROMS that do NOT have a Japan in its labels
      for (const rom of roms) {
        let romHasJapanLabel = false;
        for (const label of rom.labels) {
          if (label.includes("Japan")) {
            romHasJapanLabel = true;
            break;
          }
        }
        if (!romHasJapanLabel) rom.selected = false;
      }
      continue;
    }

    // check if any ROM in a group has World in its labels
    let groupHasWorldLabel = false;

    for (const rom of roms) {
      for (const label of rom.labels) {
        if (label.includes("World")) {
          groupHasWorldLabel = true;
          break;
        }
      }
      if (groupHasWorldLabel) break;
    }

    if (groupHasWorldLabel) {
      // unselect all ROMS that do NOT have a World in its labels
      for (const rom of roms) {
        let romHasWorldLabel = false;
        for (const label of rom.labels) {
          if (label.includes("World")) {
            romHasWorldLabel = true;
            break;
          }
        }
        if (!romHasWorldLabel) rom.selected = false;
      }
      continue;
    }
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
