import type { Dirent } from "node:fs";
import AppValidationError from "../../../../classes/errors/app-validation-error.class.js";

const buildTitleNameFromDirEntry = (
  entry: Dirent<NonSharedBuffer>,
): [string, undefined] | [undefined, AppValidationError] => {
  const filename = entry.name.toString();
  const [rawTitleName] = filename.split("(");

  if (!rawTitleName)
    return [
      undefined,
      new AppValidationError(`No title name found from filename ${filename}.`),
    ];

  const titleName = rawTitleName.trim();
  return [titleName, undefined];
};

export default buildTitleNameFromDirEntry;
