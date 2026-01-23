import type FileIOExtras from "../../../../classes/file-io/file-io-extras.class.js";
import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import logger from "../../../../objects/logger.object.js";
import type { ConsolesData } from "../../../../types/consoles-data.type.js";
import type { MediaName } from "../../../../types/media-name.type.js";
import buildMediaListsDirPaths from "./build-media-lists-dir-paths.helper.js";
import buildWriteConsoleMediaNameListOperations from "./build-write-console-media-name-list-operations.helper.js";
import validateMediaListsDirs from "./validate-media-lists-dirs.helper.js";
import writeConsoleMediaNameLists from "./write-console-media-name-lists.helper.js";

const writeMediaLists = async (
  paths: AlejandroG751JTPaths,
  consolesData: ConsolesData,
  allMediaNames: MediaName[],
  fileIOExtras: FileIOExtras,
) => {
  const mediaDirPaths = buildMediaListsDirPaths(
    paths.dirs,
    Object.entries(consolesData).map(([, c]) => c.name),
    allMediaNames,
  );

  const ops = buildWriteConsoleMediaNameListOperations(paths, consolesData);

  await validateMediaListsDirs(
    mediaDirPaths,
    ops.map((o) => o.paths.device.dir),
    fileIOExtras.allDirsExist,
  );

  logger.debug(...mediaDirPaths.project);
  logger.debug(...mediaDirPaths.device.base);

  await writeConsoleMediaNameLists(ops, fileIOExtras.fileIO.ls);
};

export default writeMediaLists;
