import type { Dirent } from "node:fs";
import type { Titles } from "../../../../../../types/roms/titles.type.js";
import Title from "../../../../../../classes/entities/title.class.js";
import logger from "../../../../../../objects/logger.object.js";
import type { Rom } from "../../../../../../interfaces/roms/rom.interface.js";
import {
  DIR,
  FILE,
} from "../../../../../../constants/fs/fs-types.constants.js";
import Roms from "../../../../../../classes/entities/roms.class.js";
import type AppConversionError from "../../../../../../classes/errors/app-conversion-error.class.js";
import buildRomLabelsAndLanguagesFromRomFilename from "../../../../../build/roms/build-rom-labels-and-languages-from-rom-filename.helper.js";

const buildTitlesFromDirEntries = (
  entries: Dirent<NonSharedBuffer>[],
  dirEntryToTitleNameFn: (
    dirEntry: Dirent<NonSharedBuffer>,
  ) => [string, undefined] | [undefined, AppConversionError],
): Titles => {
  const titles: Titles = new Map<string, Title>();

  for (const entry of entries) {
    if (entry.isSymbolicLink()) {
      logger.error(
        `Entry ${entry.name} is a symlink, which is not a valid ROM file type. Skipping entry.`,
      );
      continue;
    }

    const [titleName, conversionError] = dirEntryToTitleNameFn(entry);
    if (conversionError) continue;

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

    const { labels, languages } =
      buildRomLabelsAndLanguagesFromRomFilename(filename);

    const newRom: Rom = {
      base: { name: basename },
      file: { name: filename, type: extension },
      fs: { type: entry.isFile() ? FILE : DIR },
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

export default buildTitlesFromDirEntries;
