import type { Dirent } from "node:fs";
import AppConversionError from "../../../../../../classes/errors/app-conversion-error.class.js";

const buildTitleNameUsingOnlyRomFilename = (
  entry: Dirent<NonSharedBuffer>,
): [string, undefined] | [undefined, AppConversionError] => {
  const filename = entry.name.toString();
  const [rawTitleName] = filename.split("(");

  if (!rawTitleName)
    return [
      undefined,
      new AppConversionError(`No title name found from filename ${filename}.`),
    ];

  const titleName = rawTitleName.trim();
  return [titleName, undefined];
};

export default buildTitleNameUsingOnlyRomFilename;
