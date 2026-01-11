import DEVICE_NAMES from "../../constants/device-names.constant.js";
import type { DeviceName } from "../../types/device-name.type.js";
import type { DevicesList } from "../../types/devices-list.type.js";

const deviceNamesFromFilterDevicesList = (list: DevicesList): DeviceName[] => {
  const filterDeviceNames: DeviceName[] = [];
  for (const deviceItem of list) {
    if (deviceItem === "none") {
      filterDeviceNames.length = 0;
      break;
    } else if (deviceItem === "all") {
      filterDeviceNames.length = 0;
      DEVICE_NAMES
        .forEach((d) => filterDeviceNames.push(d));
      break;
    } else filterDeviceNames.push(deviceItem);
  }
  return filterDeviceNames;
};

export default deviceNamesFromFilterDevicesList;
