import path from "node:path";
import findDeleteAndOpenWriteOnlyFile, {
  type FindDeleteAndOpenWriteOnlyFileError,
} from "./find-delete-and-open-write-only-file.helper.js";
import writeToFileOrDelete, {
  type WriteToFileOrDeleteError,
} from "./write-to-file-or-delete.helper.js";
import type Device from "../../classes/device.class.js";

export type WriteScrappedRomsFileError =
  | FindDeleteAndOpenWriteOnlyFileError
  | WriteToFileOrDeleteError;

const writeScrappedRomsFile = async (
  device: Device,
): Promise<WriteScrappedRomsFileError | undefined> => {
  const scrappedFilePath = path.join(device.paths.base, "scrapped.txt");

  const [scrappedFileHandle, scrappedFileError] =
    await findDeleteAndOpenWriteOnlyFile(scrappedFilePath);
  if (scrappedFileError) return scrappedFileError;

  let content = "";

  for (const [consoleName, konsole] of device.consoles) {
    content += `%%%%% Scrapped titles found from console ${consoleName} %%%%%\n`;

    for (const [titleName, title] of konsole.scrappedTitles) {
      content += `===== Title: ${titleName} =====\n`;
      for (const [, rom] of title.romSet) content += `ROM: ${rom.filename}\n`;
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
