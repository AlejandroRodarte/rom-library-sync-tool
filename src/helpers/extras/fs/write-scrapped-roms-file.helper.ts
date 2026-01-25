import type { Consoles } from "../../../types/consoles.type.js";
import openFileForWriting, {
  type OpenFileForWritingError,
} from "./open-file-for-writing.helper.js";
import writeLines, { type WriteLinesError } from "./write-lines.helper.js";

export type WriteScrappedRomsFileError =
  | OpenFileForWritingError
  | WriteLinesError;

const writeScrappedRomsFile = async (
  consoles: Consoles,
  filePath: string,
): Promise<WriteScrappedRomsFileError | undefined> => {
  const [fileHandle, fileError] = await openFileForWriting(filePath, {
    overwrite: true,
  });
  if (fileError) return fileError;

  let lines: string[] = [];

  for (const [consoleName, konsole] of consoles) {
    lines.push(`%%%%% Scrapped titles found from console ${consoleName} %%%%%`);
    for (const [titleName, title] of konsole.scrappedTitles) {
      lines.push(`===== Title: ${titleName} =====`);
      for (const [, rom] of title.romSet) lines.push(`ROM: ${rom.file.name}`);
    }
  }

  const writeLinesError = await writeLines(fileHandle, lines, "utf8");

  if (writeLinesError) {
    await fileHandle.close();
    return writeLinesError;
  }

  await fileHandle.close();
};

export default writeScrappedRomsFile;
