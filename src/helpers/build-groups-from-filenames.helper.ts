import type { Groups, Rom } from "../types.js";
import extractLabelsFromFilename from "./extract-labels-from-filename.helper.js";

const buildGroupsFromFilenames = (filenames: string[]): Groups => {
  const groups: Groups = new Map<string, Rom[]>();

  for (const filename of filenames) {
    // EXAMPLE
    // rom: Super Space Invaders (USA, Europe).zip
    // title: Super Space Invaders
    const [title] = filename.split("(");

    if (!title) {
      console.error(`No title found for ROM ${filename}`);
      continue;
    }

    const labels = extractLabelsFromFilename(filename);
    const group = groups.get(title);
    const newRom: Rom = { filename, labels, selected: true };

    if (group) group.push(newRom);
    else groups.set(title, [newRom]);
  }

  return groups;
};

export default buildGroupsFromFilenames;
