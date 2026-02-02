import titlesFromRomsDirPath from "./titles-from-roms-dir-path.helper.js";
import titlesFromDirEntries from "./titles-from-dir-entries.helper.js";
import labelsAndLanguagesFromFilename from "./labels-and-languages-from-filename.helper.js";
import specialFlagsFromRoms from "./special-flags-from-roms.helper.js";
import environmentFromProcessVariables from "./environment-from-process-variables.helper.js";
import filenameIndexesToAddAndDelete from "./filename-indexes-to-add-and-delete.helper.js";
import romDiffActionFromRomDiffLine from "./rom-diff-action-from-rom-diff-line.helper.js";
import romDiffLineFromRomDiffAction from "./rom-diff-line-from-rom-diff-action.helper.js";
import steamDeckSftpClient from "./steam-deck-sftp-client.helper.js";
import deviceNamesFromSyncDevicesList from "./device-names-from-sync-devices-list.helper.js";
import deviceNamesFromDevicesList from "./device-names-from-devices-list.helper.js";
import consoleNamesFromConsolesList from "./console-names-from-consoles-list.helper.js";
import mediaNamesFromMediasList from "./media-names-from-medias-list.helper.js";
import intersectStringArraySimple from "./intersect-string-array-simple.helper.js";
import fileRightsFromDecimalMode from "./file-rights-from-decimal-mode.helper.js";
import modeFromRights from "./mode-from-rights.helper.js";
import rightsFromMode from "./rights-from-mode.helper.js";

const build = {
  titlesFromRomsDirPath,
  titlesFromFilenames: titlesFromDirEntries,
  labelsAndLanguagesFromFilename,
  specialFlagsFromRoms,
  environmentFromProcessVariables,
  filenameIndexesToAddAndDelete,
  diffActionFromDiffLine: romDiffActionFromRomDiffLine,
  diffLineFromDiffAction: romDiffLineFromRomDiffAction,
  steamDeckSftpClient,
  deviceNamesFromSyncDevicesList,
  deviceNamesFromDevicesList,
  consoleNamesFromConsolesList,
  mediaNamesFromMediasList,
  intersectStringArraySimple,
  fileRightsFromDecimalMode,
  modeFromRights,
  rightsFromMode,
};

export default build;
