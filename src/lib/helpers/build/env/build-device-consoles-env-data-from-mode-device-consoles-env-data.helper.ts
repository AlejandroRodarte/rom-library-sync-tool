import {
  DIFF,
  DIFF_SYNC,
  LIST,
  LIST_DIFF,
  LIST_DIFF_SYNC,
  SYNC,
} from "../../../constants/modes/mode-names.constants.js";
import type { GenericDeviceConsolesDataEnvData } from "../../../types/classes/devices/generic-device/env/generic-device-consoles-data-env-data.type.js";
import type { ConsoleName } from "../../../types/consoles/console-name.type.js";
import type { ModeName } from "../../../types/modes/mode-name.type.js";
import buildIntersectedStringArray from "../build-intersected-string-array.helper.js";
import buildConsoleNamesFromModes from "./build-console-names-from-modes.helper.js";

const buildDeviceConsolesEnvDataFromModeDeviceConsolesEnvData = (
  mode: ModeName,
  modeDeviceConsolesEnvData: {
    list: GenericDeviceConsolesDataEnvData;
    diff: GenericDeviceConsolesDataEnvData;
    sync: GenericDeviceConsolesDataEnvData;
  },
): GenericDeviceConsolesDataEnvData => {
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

  const deviceConsolesEnvData: GenericDeviceConsolesDataEnvData = {};
  for (const consoleName of consoleNames)
    switch (mode) {
      case LIST: {
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
      case DIFF: {
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
      case SYNC: {
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
      case LIST_DIFF: {
        const listConsoleEnvData = modeDeviceConsolesEnvData.list[consoleName];
        const diffConsoleEnvData = modeDeviceConsolesEnvData.diff[consoleName];

        if (!listConsoleEnvData || !diffConsoleEnvData) continue;

        deviceConsolesEnvData[consoleName] = {
          name: consoleName,
          "content-targets": {
            media: {
              names: buildIntersectedStringArray(
                listConsoleEnvData["content-targets"].media.names,
                diffConsoleEnvData["content-targets"].media.names,
              ),
            },
          },
        };
        break;
      }
      case DIFF_SYNC: {
        const diffConsoleEnvData = modeDeviceConsolesEnvData.diff[consoleName];
        const syncConsoleEnvData = modeDeviceConsolesEnvData.sync[consoleName];

        if (!diffConsoleEnvData || !syncConsoleEnvData) continue;

        deviceConsolesEnvData[consoleName] = {
          name: consoleName,
          "content-targets": {
            media: {
              names: buildIntersectedStringArray(
                syncConsoleEnvData["content-targets"].media.names,
                diffConsoleEnvData["content-targets"].media.names,
              ),
            },
          },
        };
        break;
      }
      case LIST_DIFF_SYNC: {
        const listConsoleEnvData = modeDeviceConsolesEnvData.list[consoleName];
        const diffConsoleEnvData = modeDeviceConsolesEnvData.diff[consoleName];
        const syncConsoleEnvData = modeDeviceConsolesEnvData.sync[consoleName];

        if (!listConsoleEnvData || !diffConsoleEnvData || !syncConsoleEnvData)
          continue;

        deviceConsolesEnvData[consoleName] = {
          name: consoleName,
          "content-targets": {
            media: {
              names: buildIntersectedStringArray(
                listConsoleEnvData["content-targets"].media.names,
                buildIntersectedStringArray(
                  diffConsoleEnvData["content-targets"].media.names,
                  syncConsoleEnvData["content-targets"].media.names,
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
