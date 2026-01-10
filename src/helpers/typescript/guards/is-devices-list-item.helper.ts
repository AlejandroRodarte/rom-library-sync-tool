import type { DevicesListItem } from "../../../types.js";
import isDeviceName from "./is-device-name.helper.js";

const isDevicesListItem = (s: string): s is DevicesListItem =>
  isDeviceName(s) || s === "none" || s === "all";

export default isDevicesListItem;
