import type { ConsoleName } from "../types/console-name.type.js";
import type { SftpCredentials } from "./sftp-credentials.interface.js";

export interface SteamDeckData {
  sync: boolean;
  paths: {
    roms: string;
    media: string;
    gamelists: string;
  };
  sftp: {
    credentials: SftpCredentials;
  };
  consoles: ConsoleName[];
}
