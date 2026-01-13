import type { ConsoleName } from "../types/console-name.type.js";
import type { MediaName } from "../types/media-name.type.js";
import type { ModeContent } from "../types/mode-content.type.js";
import type { SftpCredentials } from "./sftp-credentials.interface.js";

export interface SteamDeckData {
  paths: {
    roms: string;
    media: string;
    metadata: string;
  };
  modes: ModeContent<{ consoles: ConsoleName[]; medias: MediaName[] }>;
  sftp: {
    credentials: SftpCredentials;
  };
}
