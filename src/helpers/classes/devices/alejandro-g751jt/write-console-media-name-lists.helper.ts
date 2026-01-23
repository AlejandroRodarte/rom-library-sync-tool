import type { FileIO } from "../../../../interfaces/file-io.interface.js";
import type { WriteConsoleMediaNameListOperation } from "../../../../interfaces/write-console-media-name-list-operation.interface.js";
import writeConsoleMediaNameList from "./write-console-media-name-list.helper.js";

const writeConsoleMediaNameLists = async (
  ops: WriteConsoleMediaNameListOperation[],
  ls: FileIO["ls"],
) => {
  for (const op of ops) {
    await writeConsoleMediaNameList(op, ls);
  }
};

export default writeConsoleMediaNameLists;
