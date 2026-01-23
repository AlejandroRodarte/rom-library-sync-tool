import type FileIOExtras from "../../../../classes/file-io/file-io-extras.class.js";
import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { WriteConsoleMediaNameListOperation } from "../../../../interfaces/write-console-media-name-list-operation.interface.js";
import type { ConsolesData } from "../../../../types/consoles-data.type.js";
import type { MediaName } from "../../../../types/media-name.type.js";
import buildMediaListsDirPaths from "./build-media-lists-dir-paths.helper.js";
import buildWriteConsoleMediaNameListOperations from "./build-write-console-media-name-list-operations.helper.js";
import validateMediaListsDirs, {
  type ValidateMediaListsDirsError,
} from "./validate-media-lists-dirs.helper.js";
import writeConsoleMediaNameList from "./write-console-media-name-list.helper.js";

export type WriteMediaListsError = ValidateMediaListsDirsError;

const writeMediaLists = async (
  paths: AlejandroG751JTPaths,
  consolesData: ConsolesData,
  allMediaNames: MediaName[],
  fileIOExtras: FileIOExtras,
): Promise<
  | [WriteConsoleMediaNameListOperation["names"][], undefined]
  | [undefined, WriteMediaListsError]
> => {
  const mediaDirPaths = buildMediaListsDirPaths(
    paths.dirs,
    Object.entries(consolesData).map(([, c]) => c.name),
    allMediaNames,
  );

  const ops = buildWriteConsoleMediaNameListOperations(paths, consolesData);

  const validationError = await validateMediaListsDirs(
    mediaDirPaths, // project dirs and base device dirs
    ops.map((o) => o.paths.device.dir), // remaining device dirs
    fileIOExtras.allDirsExist,
  );

  if (validationError) return [undefined, validationError];

  const consoleMediaNamesToSkip: WriteConsoleMediaNameListOperation["names"][] =
    [];

  for (const op of ops) {
    const writeError = await writeConsoleMediaNameList(
      op,
      fileIOExtras.fileIO.ls,
    );
    if (writeError) consoleMediaNamesToSkip.push(op.names);
  }

  return [consoleMediaNamesToSkip, undefined];
};

export default writeMediaLists;
