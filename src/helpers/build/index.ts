import emptyConsoles from "./empty-consoles.helper.js";
import titlesFromRomsDirPath from "./titles-from-roms-dir-path.helper.js";
import titlesFromFilenames from "./titles-from-filenames.helper.js";
import labelsAndLanguagesFromFilename from "./labels-and-languages-from-filename.helper.js";
import specialFlagsFromRoms from "./special-flags-from-roms.helper.js";
import environmentFromProcessVariables from "./environment-from-process-variables.helper.js";
import filenameIndexesToAddAndDelete from "./filename-indexes-to-add-and-delete.helper.js";
import deviceDirPathsFromName from "./device-dir-paths-from-name.helper.js";
import diffActionFromDiffLine from "./diff-action-from-diff-line.helper.js";
import diffLineFromDiffAction from "./diff-line-from-diff-action.helper.js";
import steamDeckSftpClient from "./steam-deck-sftp-client.helper.js";
import syncFlagsFromSyncDevicesList from "./sync-flags-from-sync-devices-list.helper.js";
import deviceNamesFromFilterDevicesList from "./device-names-from-filter-devices-list.helper.js";
import deviceNamesFromSyncDevicesList from "./device-names-from-sync-devices-list.helper.js";
import consoleNamesFromDevices from "./console-names-from-devices.helper.js";

const build = {
  emptyConsoles,
  titlesFromRomsDirPath,
  titlesFromFilenames,
  labelsAndLanguagesFromFilename,
  specialFlagsFromRoms,
  environmentFromProcessVariables,
  filenameIndexesToAddAndDelete,
  deviceDirPathsFromName,
  diffActionFromDiffLine,
  diffLineFromDiffAction,
  steamDeckSftpClient,
  syncFlagsFromSyncDevicesList,
  deviceNamesFromFilterDevicesList,
  deviceNamesFromSyncDevicesList,
  consoleNamesFromDevices,
};

export default build;
