import path from "node:path";
import writeToFileOrDelete, {
  type WriteToFileOrDeleteError,
} from "./write-to-file-or-delete.helper.js";
import type Device from "../../classes/device.class.js";
import deleteAndOpenWriteOnlyFile, {
  type DeleteAndOpenWriteOnlyFileError,
} from "./delete-and-open-new-write-only-file.helper.js";

export type WriteDuplicateRomsFileError =
  | DeleteAndOpenWriteOnlyFileError
  | WriteToFileOrDeleteError;

const writeDuplicateRomsFile = async (
  device: Device,
): Promise<WriteDuplicateRomsFileError | undefined> => {
  const duplicatesFilePath = path.join(device.paths.base, "duplicates.txt");

  const [duplicatesFileHandle, duplicatesFileError] =
    await deleteAndOpenWriteOnlyFile(duplicatesFilePath);
  if (duplicatesFileError) return duplicatesFileError;

  let content = "";

  for (const [consoleName, konsole] of device.consoles) {
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
    duplicatesFilePath,
    duplicatesFileHandle,
    content,
    "utf8",
  );

  if (writeOrDeleteError) return writeOrDeleteError;
  else duplicatesFileHandle.close();
};

export default writeDuplicateRomsFile;
