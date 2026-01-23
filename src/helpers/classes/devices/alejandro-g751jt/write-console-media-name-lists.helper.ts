import type { FileIO } from "../../../../interfaces/file-io.interface.js";
import type { WriteConsoleMediaNameListOperation } from "../../../../interfaces/write-console-media-name-list-operation.interface.js";
import openFileForWriting from "../../../extras/fs/open-file-for-writing.helper.js";
import writeLines from "../../../extras/fs/write-lines.helper.js";
import writeConsoleMediaNameList from "./write-console-media-name-list.helper.js";

const fsExtras = {
  openFileForWriting,
  writeLines,
};

const writeConsoleMediaNameLists = async (
  ops: WriteConsoleMediaNameListOperation[],
  ls: FileIO["ls"],
) => {
  for (const op of ops) {
    await writeConsoleMediaNameList(op, ls);
  }
};

export default writeConsoleMediaNameLists;
