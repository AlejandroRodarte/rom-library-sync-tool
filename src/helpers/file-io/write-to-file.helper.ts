import fs, { type FileHandle } from "node:fs/promises";

const writeToFile = async (
  fileHandle: FileHandle,
  content: string,
  encoding: BufferEncoding,
) => {
  try {
    await fs.writeFile(fileHandle, content, { encoding });
  } catch (e: unknown) {
    if (e instanceof Error) return e;
    else return new Error("writeToFile(): an unknown error has happened.");
  }
};

export default writeToFile;
