import AppValidationError from "../../../classes/errors/app-validation-error.class.js";
import ALL_AND_NONE from "../../../constants/all-and-none.constant.js";
import typeGuards from "../../typescript/guards/index.js";

const deviceNames = (
  registeredDeviceNames: string[],
  rawDeviceNames: string | string[],
): [string[], undefined] | [undefined, AppValidationError] => {
  const modeDeviceNames: string[] = [];

  if (typeof rawDeviceNames === "string") {
    if (!typeGuards.isAllOrNone(rawDeviceNames))
      return [
        undefined,
        new AppValidationError(
          `List device names as a string accepts only two values: ${ALL_AND_NONE.join(", ")}.`,
        ),
      ];

    switch (rawDeviceNames) {
      case "all":
        modeDeviceNames.push(...registeredDeviceNames);
        break;
      case "none":
        break;
    }
  } else {
    if (rawDeviceNames.length > registeredDeviceNames.length)
      return [
        undefined,
        new AppValidationError(
          `You listed ${rawDeviceNames.length} devices, when you only registered data for ${registeredDeviceNames.length} of them.`,
        ),
      ];

    for (const rawListDeviceName of rawDeviceNames)
      if (!registeredDeviceNames.includes(rawListDeviceName))
        return [
          undefined,
          new AppValidationError(
            `You provided data for these devices: ${registeredDeviceNames.join(", ")}. Device ${rawListDeviceName} is NOT part of this list.`,
          ),
        ];

    modeDeviceNames.push(...rawDeviceNames);
  }

  return [modeDeviceNames, undefined];
};

export default deviceNames;
