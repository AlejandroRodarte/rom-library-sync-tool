import type Device from "../../classes/device.class.js";
import type { ConsoleName } from "../../types.js";

const consoleNamesFromDevices = (devices: Device[]) => {
  const consoleNames: ConsoleName[] = [];

  for (const device of devices)
    for (const [consoleName] of device.consoles)
      if (!consoleNames.includes(consoleName))
        consoleNames.push(consoleName);

  return consoleNames;
};

export default consoleNamesFromDevices;
