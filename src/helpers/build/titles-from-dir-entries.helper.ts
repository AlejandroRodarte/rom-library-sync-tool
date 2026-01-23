import labelsAndLanguagesFromFilename from "./labels-and-languages-from-filename.helper.js";
import Title from "../../classes/title.class.js";
import type { Titles } from "../../types/titles.type.js";
import type { Rom } from "../../interfaces/rom.interface.js";
import type { Dirent } from "node:fs";
import logger from "../../objects/logger.object.js";
import buildTitleNameFromDirEntry from "../classes/devices/alejandro-g751jt/build-title-name-from-dir-entry.helper.js";

const titlesFromDirEntries = (entries: Dirent<NonSharedBuffer>[]): Titles => {
  const titles = new Map<string, Title>();

  for (const entry of entries) {
    if (entry.isSymbolicLink()) {
      logger.error(
        `Entry ${entry.name} is a symlink, which is not a valid ROM file type. Skipping entry.`,
      );
      continue;
    }

    const [titleName, validationError] = buildTitleNameFromDirEntry(entry);
    if (validationError) continue;

    const filename = entry.name.toString();
    const { labels, languages } = labelsAndLanguagesFromFilename(filename);
    const title = titles.get(titleName);
    const newRom: Rom = {
      filename,
      labels,
      languages,
      fileType: entry.isFile() ? "file" : "dir",
    };

    if (title) title.addRom(newRom);
    else {
      const newTitle = new Title(titleName, new Map<string, Rom>());
      newTitle.addRom(newRom);
      titles.set(titleName, newTitle);
    }
  }

  for (const [_, title] of titles) title.setSelectedRomSet();
  return titles;
};

export default titlesFromDirEntries;
