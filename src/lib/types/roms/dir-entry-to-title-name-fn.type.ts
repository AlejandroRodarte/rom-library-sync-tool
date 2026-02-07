import type { Dirent } from "node:fs";
import type AppConversionError from "../../classes/errors/app-conversion-error.class.js";

export type DirEntryToTitleNameFn = (
  dirEntry: Dirent<NonSharedBuffer>,
) => [string, undefined] | [undefined, AppConversionError];
