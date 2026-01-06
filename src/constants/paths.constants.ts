import path from "node:path";

const DATA_DIR_PATH = path.join(process.env.PWD || __dirname, "data");

export const DEVICES_DIR_PATH = path.join(DATA_DIR_PATH, "devices");

export const LOCAL_ROMS_DIR_PATH =
  "/media/alejandro/3tb-ssd/home/alejandro/games/roms";

export const LOCAL_ES_DE_DOWNLOADED_MEDIA_DIR_PATH =
  "/media/alejandro/3tb-ssd/home/alejandro/pictures/gaming/emulation/es-de/downloaded-media";

export const STEAM_DECK_REMOTE_ROMS_DIR_PATH = "/home/deck/Emulation/roms";

export const STEAM_DECK_REMOTE_ES_DE_DOWNLOADED_MEDIA_DIR_PATH =
  "/home/deck/Emulation/tools/downloaded_media";
