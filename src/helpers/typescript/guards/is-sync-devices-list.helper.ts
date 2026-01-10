import type { DevicesListItem } from "../../../types.js";
import isDevicesListItem from "./is-devices-list-item.helper.js";

const isSyncDevicesList = (list: string[]): list is DevicesListItem[] =>
  list.every((item) => isDevicesListItem(item));

export default isSyncDevicesList;
