import type { ConsoleName } from "../../types/console-name.type.js";
import type { DeviceConsolesEnvData } from "../../types/device-consoles-env-data.type.js";
import type { ModeName } from "../../types/mode-name.type.js";
import consoleNamesFromModeConsoleNames from "./console-names-from-mode-console-names.helper.js";
import intersectStringArraySimple from "./intersect-string-array-simple.helper.js";

const deviceConsolesEnvDataFromModeDeviceConsolesEnvData = (
  mode: ModeName,
  modeDeviceConsolesEnvData: {
    list: DeviceConsolesEnvData;
    diff: DeviceConsolesEnvData;
    sync: DeviceConsolesEnvData;
  },
): DeviceConsolesEnvData => {
  const listConsoleNames: ConsoleName[] = Object.entries(
    modeDeviceConsolesEnvData.list,
  ).map(([, cd]) => cd.name);
  const diffConsoleNames: ConsoleName[] = Object.entries(
    modeDeviceConsolesEnvData.diff,
  ).map(([, cd]) => cd.name);
  const syncConsoleNames: ConsoleName[] = Object.entries(
    modeDeviceConsolesEnvData.sync,
  ).map(([, cd]) => cd.name);

  const consoleNames: ConsoleName[] = consoleNamesFromModeConsoleNames(mode, {
    list: listConsoleNames,
    diff: diffConsoleNames,
    sync: syncConsoleNames,
  });

  const deviceConsolesEnvData: DeviceConsolesEnvData = {};
  for (const consoleName of consoleNames)
    switch (mode) {
      case "list": {
        const listConsoleEnvData = modeDeviceConsolesEnvData.list[consoleName];
        if (!listConsoleEnvData) continue;
        deviceConsolesEnvData[consoleName] = {
          name: consoleName,
          "content-targets": {
            media: {
              names: listConsoleEnvData["content-targets"].media.names,
            },
          },
        };
        break;
      }
      case "diff": {
        const diffConsoleEnvData = modeDeviceConsolesEnvData.diff[consoleName];
        if (!diffConsoleEnvData) continue;
        deviceConsolesEnvData[consoleName] = {
          name: consoleName,
          "content-targets": {
            media: {
              names: diffConsoleEnvData["content-targets"].media.names,
            },
          },
        };
        break;
      }
      case "sync": {
        const syncConsoleEnvData = modeDeviceConsolesEnvData.sync[consoleName];
        if (!syncConsoleEnvData) continue;
        deviceConsolesEnvData[consoleName] = {
          name: consoleName,
          "content-targets": {
            media: {
              names: syncConsoleEnvData["content-targets"].media.names,
            },
          },
        };
        break;
      }
      case "diff-sync": {
        const diffConsoleEnvData = modeDeviceConsolesEnvData.diff[consoleName];
        const syncConsoleEnvData = modeDeviceConsolesEnvData.sync[consoleName];

        if (!diffConsoleEnvData || !syncConsoleEnvData) continue;

        deviceConsolesEnvData[consoleName] = {
          name: consoleName,
          "content-targets": {
            media: {
              names: intersectStringArraySimple(
                diffConsoleEnvData["content-targets"].media.names,
                syncConsoleEnvData["content-targets"].media.names,
              ),
            },
          },
        };
        break;
      }
      case "sync-list": {
        const syncConsoleEnvData = modeDeviceConsolesEnvData.sync[consoleName];
        const listConsoleEnvData = modeDeviceConsolesEnvData.list[consoleName];

        if (!listConsoleEnvData || !syncConsoleEnvData) continue;

        deviceConsolesEnvData[consoleName] = {
          name: consoleName,
          "content-targets": {
            media: {
              names: intersectStringArraySimple(
                syncConsoleEnvData["content-targets"].media.names,
                listConsoleEnvData["content-targets"].media.names,
              ),
            },
          },
        };
        break;
      }
      case "diff-sync-list":
      case "list-diff-sync-list": {
        const diffConsoleEnvData = modeDeviceConsolesEnvData.diff[consoleName];
        const syncConsoleEnvData = modeDeviceConsolesEnvData.sync[consoleName];
        const listConsoleEnvData = modeDeviceConsolesEnvData.list[consoleName];

        if (!diffConsoleEnvData || !syncConsoleEnvData || !listConsoleEnvData)
          continue;

        deviceConsolesEnvData[consoleName] = {
          name: consoleName,
          "content-targets": {
            media: {
              names: intersectStringArraySimple(
                diffConsoleEnvData["content-targets"].media.names,
                intersectStringArraySimple(
                  syncConsoleEnvData["content-targets"].media.names,
                  listConsoleEnvData["content-targets"].media.names,
                ),
              ),
            },
          },
        };
        break;
      }
    }

  return deviceConsolesEnvData;
};

export default deviceConsolesEnvDataFromModeDeviceConsolesEnvData;
