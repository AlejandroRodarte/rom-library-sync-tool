import type { Groups, Rom } from "../../types.js";
import labelsAndLanguagesFromFilename from "./labels-and-languages-from-filename.helper.js";

const groupsFromFilenames = (filenames: string[]): Groups => {
  const groups: Groups = new Map<string, Rom[]>();

  for (const filename of filenames) {
    // EXAMPLE
    // rom: Super Space Invaders (USA, Europe).zip
    // title: Super Space Invaders
    const [rawTitle] = filename.split("(");

    if (!rawTitle) {
      console.error(`No title found for ROM ${filename}`);
      continue;
    }

    const title = rawTitle.trim();
    const { labels, languages } = labelsAndLanguagesFromFilename(filename);
    const group = groups.get(title);
    const newRom: Rom = { filename, labels, languages, selected: true };

    if (group) group.push(newRom);
    else groups.set(title, [newRom]);
  }

  return groups;
};

export default groupsFromFilenames;
