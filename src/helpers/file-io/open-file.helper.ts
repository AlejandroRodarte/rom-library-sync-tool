import fs, { type FileHandle } from "node:fs/promises";
import type { PathLike } from "node:fs";

const openFile = async (
  filePath: PathLike,
  flags: string,
): Promise<[FileHandle, undefined] | [undefined, Error]> => {
  try {
    const handle = await fs.open(filePath, flags);
    return [handle, undefined];
  } catch (e: unknown) {
    if (e instanceof Error) return [undefined, e];
    else
      return [
        undefined,
        new Error("openFile(): an unknown error has occurred."),
      ];
  }
};

export default openFile;
