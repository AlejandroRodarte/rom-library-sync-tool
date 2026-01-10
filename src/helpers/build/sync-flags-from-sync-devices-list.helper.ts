import type { DevicesListItem, SyncFlags } from "../../types.js";

const syncFlagsFromSyncDevicesList = (list: DevicesListItem[]): SyncFlags => {
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
