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
  const roms = await readdir(dirPath);

  const groups: Groups = {};
  let previousTitle = "";

  for (const rom of roms) {
    // EXAMPLE
    // rom: Super Space Invaders (USA, Europe).zip
    // title: Super Space Invaders
    const [title] = rom.split("(");

    if (!title) {
      console.error(`No title found for ROM ${rom}`);
      continue;
    }

    // group ROMs by title
    if (title === previousTitle) {
      const group = groups[title];
      if (group) group.push({ filename: rom, labels: [], selected: false });
    } else {
      groups[title] = [{ filename: rom, labels: [], selected: false }];
    }

    previousTitle = title;
  }

  for (const [_, roms] of Object.entries(groups)) {
    console.log("----------");
    for (const rom of roms) {
      console.log(rom.filename);
    }
  }
};

main();
