import accessPath from "./access-path.helper.js";
import deleteFile from "./delete-file.helper.js";
import fileExistsAndIsReadable from "./file-exists-and-is-readable.helper.js";
import findAndDeleteFile from "./find-and-delete-file.helper.js";
import openNewWriteOnlyFile from "./open-new-write-only-file.helper.js";
import openFile from "./open-file.helper.js";
import readUtf8FileLines from "./read-utf8-file-lines.helper.js";
import readUtf8FileIntoString from "./read-utf8-file.helper.js";
import writeConsoleDiffFile from "./write-console-diff-file.helper.js";
import writeConsoleFiles from "./write-console-files.helper.js";
import writeRomFilenamesToConsoleFile from "./write-rom-filenames-to-console-file.helper.js";
import writeToFile from "./write-to-file.helper.js";

const fileIO = {
  writeConsoleFiles,
  writeConsoleDiffFile,
  writeRomFilenamesToConsoleFile,
  accessPath,
  fileExistsAndIsReadable,
  deleteFile,
  readUtf8FileIntoString,
  readUtf8FileLines,
  findAndDeleteFile,
  openFile,
  openNewWriteOnlyFile,
  writeToFile,
};

export default fileIO;
