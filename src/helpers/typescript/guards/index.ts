import isConsoleList from "./is-console-list.helper.js";
import isConsoleName from "./is-console-name.helper.js";
import isDeviceName from "./is-device-name.helper.js";
import isErrnoException from "./is-errno-exception.helper.js";
import isSftpError from "./is-sftp-error.helper.js";
import isSyncDevicesItem from "./is-sync-devices-item.helper.js";
import isSyncDevicesList from "./is-sync-devices-list.helper.js";

const typeGuards = {
  isErrnoException,
  isSftpError,
  isDeviceName,
  isConsoleName,
  isConsoleList,
  isSyncDevicesItem,
  isSyncDevicesList,
};

export default typeGuards;
