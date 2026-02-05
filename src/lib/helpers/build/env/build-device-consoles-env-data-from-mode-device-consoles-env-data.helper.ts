import type { GenericDeviceConsolesEnvData } from "../../../types/classes/devices/generic-device/env/generic-device-consoles-env-data.type.js";
import type { ConsoleName } from "../../../types/consoles/console-name.type.js";
import type { ModeName } from "../../../types/modes/mode-name.type.js";
import buildIntersectedStringArray from "../build-intersected-string-array.helper.js";
import buildConsoleNamesFromModes from "./build-console-names-from-modes.helper.js";

const buildDeviceConsolesEnvDataFromModeDeviceConsolesEnvData = (
  mode: ModeName,
  modeDeviceConsolesEnvData: {
    list: GenericDeviceConsolesEnvData;
    diff: GenericDeviceConsolesEnvData;
    sync: GenericDeviceConsolesEnvData;
  },
): GenericDeviceConsolesEnvData => {
  const listConsoleNames: ConsoleName[] = Object.entries(
    modeDeviceConsolesEnvData.list,
  ).map(([, cd]) => cd.name);
  const diffConsoleNames: ConsoleName[] = Object.entries(
    modeDeviceConsolesEnvData.diff,
  ).map(([, cd]) => cd.name);
  const syncConsoleNames: ConsoleName[] = Object.entries(
    modeDeviceConsolesEnvData.sync,
  ).map(([, cd]) => cd.name);

  const consoleNames: ConsoleName[] = buildConsoleNamesFromModes(mode, {
    list: listConsoleNames,
    diff: diffConsoleNames,
    sync: syncConsoleNames,
  });

  const deviceConsolesEnvData: GenericDeviceConsolesEnvData = {};
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
              names: buildIntersectedStringArray(
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
              names: buildIntersectedStringArray(
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
              names: buildIntersectedStringArray(
                diffConsoleEnvData["content-targets"].media.names,
                buildIntersectedStringArray(
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

export default buildDeviceConsolesEnvDataFromModeDeviceConsolesEnvData;
