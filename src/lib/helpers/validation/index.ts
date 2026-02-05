import isStringAbsoluteUnixPath from "./is-string-absolute-unix-path.helper.js";
import isStringInteger from "./is-string-integer.helper.js";
import isStringIpv4Address from "./is-string-ipv4-address.helper.js";
import isStringPort from "./is-string-port.helper.js";
import isStringZeroOrOne from "./is-string-zero-or-one.helper.js";

const validation = {
  isStringZeroOrOne,
  isStringAbsoluteUnixPath,
  isStringIpv4Address,
  isStringInteger,
  isStringPort,
};

export default validation;
