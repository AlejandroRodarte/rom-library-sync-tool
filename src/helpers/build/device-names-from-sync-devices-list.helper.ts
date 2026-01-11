import type { DeviceName } from "../../types/device-name.type.js";
import type { DevicesList } from "../../types/devices-list.type.js";
import typeGuards from "../typescript/guards/index.js";

const deviceNamesFromSyncDevicesList = (
  syncDevicesList: DevicesList,
  filterDeviceNames: DeviceName[],
): DeviceName[] => {
  const syncDeviceNames: DeviceName[] = [];
  for (const deviceItem of syncDevicesList) {
    if (deviceItem === "none") {
      syncDeviceNames.length = 0;
      break;
    } else if (deviceItem === "all") {
      syncDeviceNames.length = 0;
      syncDevicesList
        .filter((d) => typeGuards.isDeviceName(d))
        .filter((d) => filterDeviceNames.includes(d))
        .forEach((d) => syncDeviceNames.push(d));
      break;
    } else {
      if (filterDeviceNames.includes(deviceItem))
        syncDeviceNames.push(deviceItem);
    }
  }
  return syncDeviceNames;
};

export default deviceNamesFromSyncDevicesList;
