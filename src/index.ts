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

    // group ROMs by title
    if (title === previousTitle) {
      const group = groups[title];
      if (group) group.push({ filename, labels: [], selected: false });
    } else {
      groups[title] = [{ filename, labels: [], selected: false }];
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
