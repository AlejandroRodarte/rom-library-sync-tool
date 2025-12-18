import { readdir } from "node:fs/promises";

const dirPath = "/home/alejandro/Downloads/myrient/gamegear";

const main = async () => {
  // NOTE: output already sorts filenames in ascending order
  const roms = await readdir(dirPath);

  const groups: string[][] = [];
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
      const lastGroup = groups[groups.length - 1];
      if (lastGroup) lastGroup.push(rom);
    } else {
      const newGroup = [rom];
      groups.push(newGroup);
    }

    previousTitle = title;
  }

  for (const group of groups) {
    console.log("----------");
    for (const rom of group) {
      console.log(rom);
    }
  }
};

main();
