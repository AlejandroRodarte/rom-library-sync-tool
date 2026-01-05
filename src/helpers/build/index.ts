import emptyConsoles from "./empty-consoles.helper.js";
import titlesFromConsoleName from "./titles-from-console-name.helper.js";
import titlesFromFilenames from "./titles-from-filenames.helper.js";
import labelsAndLanguagesFromFilename from "./labels-and-languages-from-filename.helper.js";
import selectedRomFilenamesFromConsole from "./selected-rom-filenames-from-console.helper.js";
import specialFlagsFromRoms from "./special-flags-from-roms.helper.js";
import environmentFromProcessVariables from "./environment-from-process-variables.helper.js";
import filenameIndexesToAddAndDelete from "./filename-indexes-to-add-and-delete.helper.js";
import deviceDirPathsFromName from "./device-dir-paths-from-name.helper.js";

const build = {
  emptyConsoles,
  titlesFromConsoleName,
  titlesFromFilenames,
  labelsAndLanguagesFromFilename,
  selectedRomFilenamesFromConsole,
  specialFlagsFromRoms,
  environmentFromProcessVariables,
  filenameIndexesToAddAndDelete,
  deviceDirPathsFromName,
};

export default build;
