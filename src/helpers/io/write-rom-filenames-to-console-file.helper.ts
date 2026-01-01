import { closeSync, openSync, writeSync, type PathLike } from "node:fs";

const writeRomFilenamesToConsoleFile = (
  filePath: PathLike,
  filenames: string[],
): void => {
  const consoleFileDescriptor = openSync(filePath, "w");

  let content = "";
  for (const [index, filename] of filenames.entries()) {
    const lastItem = index === filenames.length - 1;
    if (!lastItem) content += `${filename}\n`;
    else content += filename;
  }

  writeSync(consoleFileDescriptor, content, null, "utf8");
  closeSync(consoleFileDescriptor);
};

export default writeRomFilenamesToConsoleFile;
