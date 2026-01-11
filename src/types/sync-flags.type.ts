import type { DeviceName } from "./device-name.type.js";

export type SyncFlags = {
  [D in DeviceName]: boolean;
};
