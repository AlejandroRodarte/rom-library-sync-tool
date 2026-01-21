import type FileIOExtras from "../../../../classes/file-io/file-io-extras.class.js";
import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { ConsoleName } from "../../../../types/console-name.type.js";
import type { DeviceName } from "../../../../types/device-name.type.js";
import validateRomsListsDirs from "./validate-roms-lists-dirs.helper.js";
import writeConsoleRomsList from "./write-console-roms-list.helper.js";

const writeRomsLists = async (
  name: DeviceName,
  paths: AlejandroG751JTPaths,
  consoleNames: ConsoleName[],
  fileIOExtras: FileIOExtras,
) => {
  await validateRomsListsDirs(name, paths, consoleNames, fileIOExtras);

  for (const consoleName of consoleNames) {
    await writeConsoleRomsList(name, consoleName, paths, fileIOExtras);
  }
};

export default writeRomsLists;
