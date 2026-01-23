import labelsAndLanguagesFromFilename from "./labels-and-languages-from-filename.helper.js";
import Title from "../../classes/title.class.js";
import type { Titles } from "../../types/titles.type.js";
import type { Rom } from "../../interfaces/rom.interface.js";
import type { Dirent } from "node:fs";
import logger from "../../objects/logger.object.js";

const titlesFromDirEntries = (entries: Dirent<NonSharedBuffer>[]): Titles => {
  const titles = new Map<string, Title>();

  for (const entry of entries) {
    const filename = entry.name.toString();

    if (entry.isSymbolicLink()) {
      logger.error(
        `Entry with filename ${filename} is a symlink, which is not a valid ROM file type. Skipping entry.`,
      );
      continue;
    }

    const [rawTitleName] = filename.split("(");

    if (!rawTitleName) {
      console.error(`No title found for ROM ${filename}.`);
      continue;
    }

    const titleName = rawTitleName.trim();
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
