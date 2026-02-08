import logger from "../../../../../objects/logger.object.js";
import type { Consoles } from "../../../../../types/consoles/consoles.type.js";
import openFileForWriting, {
  type OpenFileForWritingError,
} from "../../../../extras/fs/open-file-for-writing.helper.js";
import writeLines, {
  type WriteLinesError,
} from "../../../../extras/fs/write-lines.helper.js";

export type WriteDuplicateRomsFileError =
  | OpenFileForWritingError
  | WriteLinesError;

const writeDuplicateRomsFile = async (
  consoles: Consoles,
  filePath: string,
): Promise<WriteDuplicateRomsFileError | undefined> => {
  const [fileHandle, fileError] = await openFileForWriting(filePath, {
    overwrite: true,
  });
  if (fileError) return fileError;

  let lines: string[] = [];

  for (const [consoleName, konsole] of consoles) {
    lines.push(`%%%%% Duplicates found on console ${consoleName} %%%%%`);
    for (const [romsSelected, titles] of konsole.games.duplicateTitles) {
      lines.push(`***** Titles with ${romsSelected} duplicates *****`);
      for (const [titleName, title] of titles) {
        lines.push(`===== Title: ${titleName} =====`);
        for (const [, rom] of title.selectedRoms.entries)
          lines.push(`ROM: ${rom.file.name}`);
      }
    }
  }

  const writeLinesError = await writeLines(fileHandle, lines, "utf8");

  if (writeLinesError) {
    await fileHandle.close();
    return writeLinesError;
  }

  logger.info(`Successfully wrote duplicate ROMs file at ${filePath}.`);
  await fileHandle.close();
};

export default writeDuplicateRomsFile;
