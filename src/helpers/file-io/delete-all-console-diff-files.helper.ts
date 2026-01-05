import path from "path";
import { LOCAL_ROM_DIFFS_DIR_PATH } from "../../constants/paths.constants.js";
import findAndDeleteFile from "./find-and-delete-file.helper.js";

const deleteAllConsoleDiffFiles = async (
  consoleNames: string[],
): Promise<void> => {
  for (const name of consoleNames) {
    const diffFilePath = path.join(
      LOCAL_ROM_DIFFS_DIR_PATH,
      `${name}.diff.txt`,
    );

    const deleteError = await findAndDeleteFile(diffFilePath, false);
    if (deleteError) console.log(deleteError.message);
  }
};

export default deleteAllConsoleDiffFiles;
