import type { DeviceName, DevicesList } from "../../types.js";
import typeGuards from "../typescript/guards/index.js";

const deviceNamesFromFilterDevicesList = (list: DevicesList): DeviceName[] => {
  const filterDeviceNames: DeviceName[] = [];
  for (const deviceItem of list) {
    if (deviceItem === "none") {
      filterDeviceNames.length = 0;
      break;
    } else if (deviceItem === "all") {
      filterDeviceNames.length = 0;
      list
        .filter((d) => typeGuards.isDeviceName(d))
        .forEach((d) => filterDeviceNames.push(d));
      break;
    } else filterDeviceNames.push(deviceItem);
  }
  return filterDeviceNames;
};

export default deviceNamesFromFilterDevicesList;
