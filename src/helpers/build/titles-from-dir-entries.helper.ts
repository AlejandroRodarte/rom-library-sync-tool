import labelsAndLanguagesFromFilename from "./labels-and-languages-from-filename.helper.js";
import Title from "../../classes/title.class.js";
import type { Titles } from "../../types/titles.type.js";
import type { Rom } from "../../interfaces/rom.interface.js";
import type { Dirent } from "node:fs";
import logger from "../../objects/logger.object.js";
import buildTitleNameFromDirEntry from "../classes/devices/generic-device/build-title-name-from-dir-entry.helper.js";
import Roms from "../../classes/roms.class.js";

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
    const lastDotIndex = filename.lastIndexOf(".");

    if (entry.isFile() && lastDotIndex === -1) {
      logger.error(
        `Entry ${entry.name} is a file, and does not have a dot that separates basename from extension. Skipping entry.`,
      );
      continue;
    }

    const basename =
      lastDotIndex === -1 ? filename : filename.substring(0, lastDotIndex);
    const extension = filename.substring(lastDotIndex + 1);

    const { labels, languages } = labelsAndLanguagesFromFilename(filename);

    const newRom: Rom = {
      base: { name: basename },
      file: { name: filename, type: extension },
      fs: { type: entry.isFile() ? "file" : "dir" },
      labels,
      languages,
    };

    const title = titles.get(titleName);

    if (title) title.addRom(newRom);
    else {
      const newTitle = new Title(titleName, new Roms());
      newTitle.addRom(newRom);
      titles.set(titleName, newTitle);
    }
  }

  return titles;
};

export default titlesFromDirEntries;
