import isConsoleList from "./is-console-list.helper.js";
import isConsoleName from "./is-console-name.helper.js";
import isDeviceName from "./is-device-name.helper.js";
import isErrnoException from "./is-errno-exception.helper.js";
import isSftpError from "./is-sftp-error.helper.js";
import isDevicesListItem from "./is-devices-list-item.helper.js";
import isDevicesList from "./is-devices-list.helper.js";
import isLogLevel from "./is-log-level.helper.js";
import isMediaName from "./is-media-name.helper.js";
import isMediaList from "./is-media-list.helper.js";
import isMediasListItem from "./is-medias-list-item.helper.js";
import isMediasList from "./is-medias-list.helper.js";
import isConsolesListItem from "./is-consoles-list-item.helper.js";
import isConsolesList from "./is-consoles-list.helper.js";
import isModeName from "./is-mode-name.helper.js";
import isRight from "./is-right.helper.js";
import isRightList from "./is-right-list.helper.js";
import isContentTargetName from "./is-content-target-name.helper.js";
import isContentTargetList from "./is-content-target-list.helper.js";
import isContentTargetsListItem from "./is-content-targets-list-item.helper.js";
import isContentTargetsList from "./is-content-targets-list.helper.js";
import isFileIOStrategy from "./is-file-io-strategy.helper.js";
import isFileIOFsCrudStrategy from "./is-file-io-fs-crud-strategy.helper.js";
import isConsolesListItemOrRest from "./is-consoles-list-item-or-rest.helper.js";
import isRomFsType from "./is-rom-fs-type.helper.js";
import isMediaFsType from "./is-media-fs-type.helper.js";
import isRomDiffActionType from "./is-rom-diff-action.type.helper.js";
import isMediaDiffActionType from "./is-media-diff-action.type.helper.js";

const typeGuards = {
  isErrnoException,
  isSftpError,
  isDeviceName,
  isConsoleName,
  isConsoleList,
  isDevicesListItem,
  isDevicesList,
  isLogLevel,
  isMediaName,
  isMediaList,
  isMediasListItem,
  isMediasList,
  isConsolesListItem,
  isConsolesList,
  isModeName,
  isRight,
  isRightList,
  isFileIOStrategy,
  isFileIOFsCrudStrategy,
  isContentTargetName,
  isContentTargetList,
  isContentTargetsListItem,
  isContentTargetsList,
  isConsolesListItemOrRest,
  isRomFsType,
  isMediaFsType,
  isRomDiffActionType,
  isMediaDiffActionType,
};

export default typeGuards;
