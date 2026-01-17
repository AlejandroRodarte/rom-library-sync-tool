import writeToFileOrDelete, {
  type WriteToFileOrDeleteError,
} from "./write-to-file-or-delete.helper.js";
import deleteAndOpenWriteOnlyFile, {
  type DeleteAndOpenWriteOnlyFileError,
} from "./delete-and-open-new-write-only-file.helper.js";
import type { Consoles } from "../../../types/consoles.type.js";

export type WriteScrappedRomsFileError =
  | DeleteAndOpenWriteOnlyFileError
  | WriteToFileOrDeleteError;

const writeScrappedRomsFile = async (
  consoles: Consoles,
  filePath: string,
): Promise<WriteScrappedRomsFileError | undefined> => {
  const [fileHandle, scrappedFileError] =
    await deleteAndOpenWriteOnlyFile(filePath);
  if (scrappedFileError) return scrappedFileError;

  let content = "";

  for (const [consoleName, konsole] of consoles) {
    content += `%%%%% Scrapped titles found from console ${consoleName} %%%%%\n`;

    for (const [titleName, title] of konsole.scrappedTitles) {
      content += `===== Title: ${titleName} =====\n`;
      for (const [, rom] of title.romSet) content += `ROM: ${rom.filename}\n`;
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

export default writeScrappedRomsFile;
