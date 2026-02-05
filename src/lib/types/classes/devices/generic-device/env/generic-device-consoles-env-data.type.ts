import type { GenericDeviceConsoleEnvData } from "../../../../../interfaces/classes/devices/generic-device/env/generic-device-console-env-data.interface.js";
import type { ConsoleContent } from "../../../../consoles/console-content.type.js";

export type GenericDeviceConsolesEnvData = Partial<
  ConsoleContent<GenericDeviceConsoleEnvData>
>;
