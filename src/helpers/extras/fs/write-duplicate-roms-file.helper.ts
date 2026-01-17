import writeToFileOrDelete, {
  type WriteToFileOrDeleteError,
} from "./write-to-file-or-delete.helper.js";
import deleteAndOpenWriteOnlyFile, {
  type DeleteAndOpenWriteOnlyFileError,
} from "./delete-and-open-new-write-only-file.helper.js";
import type { Consoles } from "../../../types/consoles.type.js";

export type WriteDuplicateRomsFileError =
  | DeleteAndOpenWriteOnlyFileError
  | WriteToFileOrDeleteError;

const writeDuplicateRomsFile = async (
  consoles: Consoles,
  filePath: string,
): Promise<WriteDuplicateRomsFileError | undefined> => {
  const [fileHandle, fileError] = await deleteAndOpenWriteOnlyFile(filePath);
  if (fileError) return fileError;

  let content = "";

  for (const [consoleName, konsole] of consoles) {
    content += `%%%%% Duplicates found on console ${consoleName} %%%%%\n`;
    for (const [romsSelected, titles] of konsole.duplicateTitles) {
      content += `***** Titles with ${romsSelected} duplicates *****\n`;
      for (const [titleName, title] of titles) {
        content += `===== Title: ${titleName} =====\n`;
        for (const [, rom] of title.selectedRomSet)
          content += `ROM: ${rom.filename}\n`;
      }
    }
  }

  const writeOrDeleteError = await writeToFileOrDelete(
    filePath,
    fileHandle,
    content,
    "utf8",
  );

  if (writeOrDeleteError) return writeOrDeleteError;
  else fileHandle.close();
};

export default writeDuplicateRomsFile;
