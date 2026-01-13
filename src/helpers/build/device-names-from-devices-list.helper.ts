import DEVICE_NAMES from "../../constants/device-names.constant.js";
import type { DeviceName } from "../../types/device-name.type.js";
import type { DevicesList } from "../../types/devices-list.type.js";

const deviceNamesFromDevicesList = (devicesList: DevicesList): DeviceName[] => {
  const deviceNames: DeviceName[] = [];

  for (const deviceListItem of devicesList) {
    if (deviceListItem === "none") {
      deviceNames.length = 0;
      break;
    } else if (deviceListItem === "all") {
      deviceNames.length = 0;
      DEVICE_NAMES.forEach((d) => deviceNames.push(d));
      break;
    } else deviceNames.push(deviceListItem);
  }

  return deviceNames;
};

export default deviceNamesFromDevicesList;
