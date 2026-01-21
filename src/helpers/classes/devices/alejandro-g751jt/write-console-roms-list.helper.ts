import type { FileIO } from "../../../../interfaces/file-io.interface.js";
import logger from "../../../../objects/logger.object.js";
import openFileForWriting from "../../../extras/fs/open-file-for-writing.helper.js";
import writeLines from "../../../extras/fs/write-lines.helper.js";

const writeConsoleRomsList = async (
  paths: {
    device: string;
    project: string;
  },
  ls: FileIO["ls"],
) => {
  const [lsEntries, lsError] = await ls(paths.device);

  if (lsError) {
    logger.error(`${lsError.toString()}`, "Skipping this console.");
    return;
  }

  const filenames = lsEntries
    .map((e) => e.name)
    .filter((n) => n !== "systeminfo.txt" && n !== "metadata.txt");

  const [listFileHandle, listFileError] = await openFileForWriting(
    paths.project,
    { overwrite: true },
  );

  if (listFileError) {
    return;
  }

  const writeLinesError = await writeLines(listFileHandle, filenames);

  if (writeLinesError) {
    await listFileHandle.close();
    return;
  }
};

export default writeConsoleRomsList;
