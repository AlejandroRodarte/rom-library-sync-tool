import type { Consoles } from "../types/consoles.type.js";
import type { DeviceName } from "../types/device-name.type.js";
import type { DeviceWriteMethods } from "./device-write-methods.interface.js";

export interface Device {
  name: () => DeviceName;
  consoles: () => Consoles;
  populate: () => Promise<void>;
  filter: () => void;
  update: () => void;
  write: DeviceWriteMethods;
  sync: () => Promise<void>;
}
