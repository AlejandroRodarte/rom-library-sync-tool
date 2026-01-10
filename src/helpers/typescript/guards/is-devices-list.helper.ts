import type { DevicesList } from "../../../types.js";
import isDevicesListItem from "./is-devices-list-item.helper.js";

const isDevicesList = (list: string[]): list is DevicesList =>
  list.every((item) => isDevicesListItem(item));

export default isDevicesList;
