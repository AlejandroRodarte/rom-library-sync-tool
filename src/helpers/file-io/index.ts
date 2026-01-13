import accessPath from "./access-path.helper.js";
import deleteFile from "./delete-file.helper.js";
import fileExistsAndIsReadable from "./file-exists-and-is-readable.helper.js";
import openNewWriteOnlyFile from "./open-new-write-only-file.helper.js";
import openFile from "./open-file.helper.js";
import readUtf8FileLines from "./read-utf8-file-lines.helper.js";
import readUtf8FileIntoString from "./read-utf8-file-into-string.helper.js";
import writeToFile from "./write-to-file.helper.js";
import writeConsoleDiffFile from "./write-console-diff-file.helper.js";
import writeToFileOrDelete from "./write-to-file-or-delete.helper.js";
import writeAddFileLineToDiffFile from "./write-add-file-line-to-diff-file.helper.js";
import writeDeleteFileLineToDiffFile from "./write-delete-file-line-to-diff-file.helper.js";
import writeConsoleListFile from "./write-console-list-file.helper.js";
import dirExistsAndIsReadableAndWritable from "./dir-exists-and-is-readable-and-writable.helper.js";
import dirExists from "./dir-exists.helper.js";
import dirExistsAndIsReadable from "./dir-exists-and-is-readable.helper.js";
import fileExists from "./file-exists.helper.js";
import fileIsEmpty from "./file-is-empty.helper.js";
import deleteAndOpenWriteOnlyFile from "./delete-and-open-new-write-only-file.helper.js";
import fileExistsAndReadUtf8Lines from "./file-exists-and-read-utf8-lines.helper.js";
import stats from "./stats.helper.js";
import access from "./access.helper.js";
import anyFileExists from "./any-file-exists.helper.js";
import allDirsExistAndAreReadableAndWritable from "./all-dirs-exist-and-are-readable-and-writable.helper.js";
import writeDuplicateRomsFile from "./write-duplicate-roms-file.helper.js";
import writeScrappedRomsFile from "./write-scrapped-roms-file.helper.js";
import readdir from "./readdir.helper.js";
import symlinkExists from "./symlink-exists.helper.js";
import unlink from "./unlink.helper.js";
import symlink from "./symlink.helper.js";
import createFileSymlink from "./create-file-symlink.helper.js";
import deleteFileSymlink from "./delete-file-symlink.helper.js";
import allDirsExistAndAreReadable from "./all-dirs-exist-and-are-readable.helper.js";
import allFilesExistAndAreReadable from "./all-files-exist-and-are-readable.helper.js";

const fileIO = {
  accessPath,
  fileExistsAndIsReadable,
  deleteFile,
  readUtf8FileIntoString,
  readUtf8FileLines,
  openFile,
  openNewWriteOnlyFile,
  writeToFile,
  writeConsoleDiffFile,
  writeToFileOrDelete,
  writeAddFileLineToDiffFile,
  writeDeleteFileLineToDiffFile,
  writeConsoleListFile,
  dirExistsAndIsReadableAndWritable,
  dirExists,
  dirExistsAndIsReadable,
  fileExists,
  fileIsEmpty,
  deleteAndOpenWriteOnlyFile,
  fileExistsAndReadUtf8Lines,
  stats,
  access,
  anyFileExists,
  allDirsExistAndAreReadableAndWritable,
  writeDuplicateRomsFile,
  writeScrappedRomsFile,
  readdir,
  symlinkExists,
  unlink,
  symlink,
  createFileSymlink,
  deleteFileSymlink,
  allDirsExistAndAreReadable,
  allFilesExistAndAreReadable,
};

export default fileIO;
