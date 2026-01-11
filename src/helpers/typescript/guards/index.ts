import isConsoleList from "./is-console-list.helper.js";
import isConsoleName from "./is-console-name.helper.js";
import isDeviceName from "./is-device-name.helper.js";
import isErrnoException from "./is-errno-exception.helper.js";
import isSftpError from "./is-sftp-error.helper.js";
import isDevicesListItem from "./is-devices-list-item.helper.js";
import isDevicesList from "./is-devices-list.helper.js";
import isLogLevel from "./is-log-level.helper.js";

const typeGuards = {
  isErrnoException,
  isSftpError,
  isDeviceName,
  isConsoleName,
  isConsoleList,
  isDevicesListItem,
  isDevicesList,
  isLogLevel,
};

export default typeGuards;
