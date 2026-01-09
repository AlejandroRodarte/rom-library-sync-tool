import type { SyncDevicesItem } from "../../../types.js";
import isSyncDevicesItem from "./is-sync-devices-item.helper.js";

const isSyncDevicesList = (list: string[]): list is SyncDevicesItem[] =>
  list.every((item) => isSyncDevicesItem(item));

export default isSyncDevicesList;
