import type { SyncDevicesItem } from "../../../types.js";
import isDeviceName from "./is-device-name.helper.js";

const isSyncDevicesItem = (s: string): s is SyncDevicesItem =>
  isDeviceName(s) || s === "none";

export default isSyncDevicesItem;
