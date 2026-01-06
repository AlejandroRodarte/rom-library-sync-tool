import fs from "node:fs/promises";
import type { PathLike } from "node:fs";

const readUtf8FileIntoString = async (
  filePath: PathLike,
): Promise<[string, undefined] | [undefined, Error]> => {
  try {
    const buffer = await fs.readFile(filePath, { encoding: "utf8", flag: "r" });
    return [buffer, undefined];
  } catch (e: unknown) {
    if (e instanceof Error) return [undefined, e];
    else
      return [
        undefined,
        new Error("readFileIntoBuffer(): an unknown error has occured."),
      ];
  }
};

export default readUtf8FileIntoString;
