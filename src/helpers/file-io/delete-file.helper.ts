import type { PathLike } from "node:fs";
import fs from "node:fs/promises";

const deleteFile = async (filePath: PathLike) => {
  try {
    await fs.unlink(filePath);
    return undefined;
  } catch (e: unknown) {
    if (e instanceof Error) return e;
    else return new Error("deleteFile(), an unknown error has occured.");
  }
};

export default deleteFile;
