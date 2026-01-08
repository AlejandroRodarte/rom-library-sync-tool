import path from "node:path";
import type { Consoles } from "../../types.js";
import build from "../build/index.js";
import findDeleteAndOpenWriteOnlyFile, {
  type FindDeleteAndOpenWriteOnlyFileError,
} from "./find-delete-and-open-write-only-file.helper.js";
import writeToFileOrDelete, {
  type WriteToFileOrDeleteError,
} from "./write-to-file-or-delete.helper.js";

export type WriteScrappedRomsFileError =
  | FindDeleteAndOpenWriteOnlyFileError
  | WriteToFileOrDeleteError;

const writeScrappedRomsFile = async (
  deviceName: string,
  consoles: Consoles,
): Promise<WriteScrappedRomsFileError | undefined> => {
  const devicePaths = build.deviceDirPathsFromName(deviceName);

  const scrappedFilePath = path.join(devicePaths.base, "scrapped.txt");

  const [scrappedFileHandle, scrappedFileError] =
    await findDeleteAndOpenWriteOnlyFile(scrappedFilePath);
  if (scrappedFileError) return scrappedFileError;

  let content = "";

  for (const [consoleName, konsole] of consoles) {
    content += `%%%%% Scrapped titles found from console ${consoleName} %%%%%\n`;

    for (const [romsSelected, titles] of konsole) {
      if (romsSelected !== 0) continue;
      for (const [titleName, title] of titles) {
        content += `===== Title: ${titleName} =====\n`;
        for (const [, rom] of title.romSet) content += `ROM: ${rom.filename}\n`;
      }
    }
  }

  const writeOrDeleteError = await writeToFileOrDelete(
    scrappedFilePath,
    scrappedFileHandle,
    content,
    "utf8",
  );

  if (writeOrDeleteError) return writeOrDeleteError;
  else scrappedFileHandle.close();
};

export default writeScrappedRomsFile;
