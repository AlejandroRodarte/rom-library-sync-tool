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
};

export default typeGuards;
