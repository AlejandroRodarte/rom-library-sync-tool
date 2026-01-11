import labelsAndLanguagesFromFilename from "./labels-and-languages-from-filename.helper.js";
import Title from "../../classes/title.class.js";
import type { Titles } from "../../types/titles.type.js";
import type { Rom } from "../../interfaces/rom.interface.js";

const titlesFromFilenames = (filenames: string[]): Titles => {
  const titles = new Map<string, Title>();

  for (const filename of filenames) {
    // EXAMPLE
    // rom: Super Space Invaders (USA, Europe).zip
    // title: Super Space Invaders
    const [rawName] = filename.split("(");

    if (!rawName) {
      console.error(`No title found for ROM ${filename}`);
      continue;
    }

    const name = rawName.trim();
    const { labels, languages } = labelsAndLanguagesFromFilename(filename);
    const title = titles.get(name);
    const newRom: Rom = { filename, labels, languages, selected: true };

    if (title) title.addRom(newRom);
    else {
      const newTitle = new Title(name, new Map<string, Rom>());
      newTitle.addRom(newRom);
      titles.set(name, newTitle);
    }
  }

  for (const [_, title] of titles) title.setSelectedRomSet();
  return titles;
};

export default titlesFromFilenames;
