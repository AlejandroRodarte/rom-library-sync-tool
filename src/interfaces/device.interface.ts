import type { DeviceWriteMethods } from "./device-write-methods.interface.js";

export interface Device {
  populate: () => Promise<void>;
  filter: () => void;
  write: DeviceWriteMethods;
  sync: () => Promise<void>;
}
