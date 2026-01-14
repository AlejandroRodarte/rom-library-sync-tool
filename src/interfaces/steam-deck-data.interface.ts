import type { SftpCredentials } from "./sftp-credentials.interface.js";
import type { SteamDeckModeData } from "./steam-deck-mode-data.interface.js";
import type { ModeName } from "../types/mode-name.type.js";

export interface SteamDeckData {
  paths: {
    roms: string;
    media: string;
    metadata: string;
  };
  modes: {
    [M in ModeName]: SteamDeckModeData<M>;
  };
  sftp: {
    credentials: SftpCredentials;
  };
}
