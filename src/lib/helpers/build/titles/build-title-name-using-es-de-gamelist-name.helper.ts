import type { Dirent } from "node:fs";
import type Gamelist from "../../../classes/entities/gamelist.class.js";
import AppConversionError from "../../../classes/errors/app-conversion-error.class.js";
import { DIR, FILE } from "../../../constants/fs/fs-types.constants.js";
import type { EsDeGamelistItem } from "../../../types/es-de-gamelists/es-de-gamelist-item.type.js";
import buildTitleNameUsingOnlyRomFilename from "./build-title-name-only-using-rom-filename.helper.js";

const buildTitleNameUsingEsDeGamelistName = (
  entry: Dirent<NonSharedBuffer>,
  gamelist: Gamelist,
): [string, undefined] | [undefined, AppConversionError] => {
  if (entry.isSymbolicLink())
    return [
      undefined,
      new AppConversionError(`This function does not support symlinks.`),
    ];

  const romFilename = entry.name.toString();
  const romFsType = entry.isFile() ? FILE : DIR;

  let esDeGamelistItem: EsDeGamelistItem | undefined;

  switch (romFsType) {
    case "file":
      esDeGamelistItem = gamelist.getGame(romFilename);
      break;
    case "dir":
      esDeGamelistItem = gamelist.getFolder(romFilename);
      break;
  }

  if (esDeGamelistItem && esDeGamelistItem.name)
    return [esDeGamelistItem.name, undefined];

  const [defaultTitleName, defaultConversionError] =
    buildTitleNameUsingOnlyRomFilename(entry);

  if (defaultConversionError) return [undefined, defaultConversionError];
  return [defaultTitleName, undefined];
};

export default buildTitleNameUsingEsDeGamelistName;
