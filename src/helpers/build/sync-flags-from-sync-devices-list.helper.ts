import type { DevicesList } from "../../types/devices-list.type.js";
import type { SyncFlags } from "../../types/sync-flags.type.js";

const syncFlagsFromSyncDevicesList = (list: DevicesList): SyncFlags => {
  const syncFlags: SyncFlags = {
    local: false,
    "steam-deck": false,
  };

  for (const device of list) {
    if (device === "none") {
      syncFlags.local = false;
      syncFlags["steam-deck"] = false;
      break;
    }

    switch (device) {
      case "local":
        syncFlags.local = true;
        break;
      case "steam-deck":
        syncFlags["steam-deck"] = true;
        break;
    }
  }

  return syncFlags;
};

export default syncFlagsFromSyncDevicesList;
