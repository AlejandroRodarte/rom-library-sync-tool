import type { LocalData } from "../interfaces/local-data.interface.js";
import type { SteamDeckData } from "../interfaces/steam-deck-data.interface.js";
import type { DeviceName } from "./device-name.type.js";

export type DeviceData<D extends DeviceName> = D extends "local"
  ? LocalData
  : D extends "steam-deck"
    ? SteamDeckData
    : never;
