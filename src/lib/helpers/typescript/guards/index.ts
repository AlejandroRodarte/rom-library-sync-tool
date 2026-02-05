import isConsoleList from "./is-console-list.helper.js";
import isConsoleName from "./is-console-name.helper.js";
import isErrnoException from "./is-errno-exception.helper.js";
import isSftpError from "./is-sftp-error.helper.js";
import isLogLevel from "./is-log-level.helper.js";
import isMediaName from "./is-media-name.helper.js";
import isMediaList from "./is-media-list.helper.js";
import isModeName from "./is-mode-name.helper.js";
import isIndividualRight from "./is-individual-right.helper.js";
import isIndividualRightList from "./is-individual-right-list.helper.js";
import isContentTargetName from "./is-content-target-name.helper.js";
import isContentTargetList from "./is-content-target-list.helper.js";
import isFileIOStrategy from "./is-file-io-strategy.helper.js";
import isFileIOFsCrudStrategy from "./is-file-io-fs-crud-strategy.helper.js";
import isRomFsType from "./is-rom-fs-type.helper.js";
import isMediaFsType from "./is-media-fs-type.helper.js";
import isRomDiffActionType from "./is-rom-diff-action.type.helper.js";
import isMediaDiffActionType from "./is-media-diff-action.type.helper.js";
import isContentTargetPaths from "./is-content-target-paths.helper.js";
import isAllOrNone from "./is-all-or-none.helper.js";
import isConsoleNameAllNoneOrRest from "./is-console-name-all-none-or-rest.helper.js";
import isConsoleNameAllNoneOrRestList from "./is-console-name-all-none-or-rest-list.helper.js";
import isNone from "./is-none.helper.js";

const typeGuards = {
  isErrnoException,
  isSftpError,
  isConsoleName,
  isConsoleList,
  isLogLevel,
  isMediaName,
  isMediaList,
  isModeName,
  isIndividualRight,
  isIndividualRightList,
  isFileIOStrategy,
  isFileIOFsCrudStrategy,
  isContentTargetName,
  isContentTargetList,
  isRomFsType,
  isMediaFsType,
  isRomDiffActionType,
  isMediaDiffActionType,
  isContentTargetPaths,
  isAllOrNone,
  isConsoleNameAllNoneOrRest,
  isConsoleNameAllNoneOrRestList,
  isNone,
};

export default typeGuards;
