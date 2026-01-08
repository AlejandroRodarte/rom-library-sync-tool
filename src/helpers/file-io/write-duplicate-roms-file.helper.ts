import path from "node:path";
import type { Consoles } from "../../types.js";
import build from "../build/index.js";
import findDeleteAndOpenWriteOnlyFile, {
  type FindDeleteAndOpenWriteOnlyFileError,
} from "./find-delete-and-open-write-only-file.helper.js";
import writeToFileOrDelete, {
  type WriteToFileOrDeleteError,
} from "./write-to-file-or-delete.helper.js";

export type WriteDuplicateRomsFileError =
  | FindDeleteAndOpenWriteOnlyFileError
  | WriteToFileOrDeleteError;

const writeDuplicateRomsFile = async (
  deviceName: string,
  consoles: Consoles,
): Promise<WriteDuplicateRomsFileError | undefined> => {
  const devicePaths = build.deviceDirPathsFromName(deviceName);

  const duplicatesFilePath = path.join(devicePaths.base, "duplicates.txt");

  const [duplicatesFileHandle, duplicatesFileError] =
    await findDeleteAndOpenWriteOnlyFile(duplicatesFilePath);
  if (duplicatesFileError) return duplicatesFileError;

  let content = "";

  for (const [consoleName, konsole] of consoles) {
    content += `%%%%% Duplicates found on console ${consoleName} %%%%%\n`;

    for (const [romsSelected, titles] of konsole) {
      if (romsSelected <= 1) continue;
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
