import isConsoleList from "./is-console-list.helper.js";
import isConsoleName from "./is-console-name.helper.js";
import isDeviceName from "./is-device-name.helper.js";
import isErrnoException from "./is-errno-exception.helper.js";
import isSftpError from "./is-sftp-error.helper.js";

const typeGuards = {
  isErrnoException,
  isSftpError,
  isDeviceName,
  isConsoleName,
  isConsoleList,
};

export default typeGuards;
