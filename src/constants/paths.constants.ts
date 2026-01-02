import path from "node:path";

const DATA_DIR_PATH = path.resolve(process.env.PWD || __dirname, "data");
const DEVICES_DIR_PATH = path.resolve(DATA_DIR_PATH, "devices");

export const LOCAL_ROMS_DIR_PATH =
  "/media/alejandro/3tb-ssd/home/alejandro/games/roms";

const LOCAL_DIR_PATH = path.resolve(DEVICES_DIR_PATH, "local");

export const LOCAL_ROM_LISTS_DIR_PATH = path.resolve(LOCAL_DIR_PATH, "lists");
export const LOCAL_ROM_DIFFS_DIR_PATH = path.resolve(LOCAL_DIR_PATH, "diffs");
export const LOCAL_ROM_FAILED_DIR_PATH = path.resolve(LOCAL_DIR_PATH, "failed");

export const STEAM_DECK_REMOTE_ROMS_DIR_PATH = "/home/deck/Emulation/roms";

const STEAM_DECK_DIR_PATH = path.resolve(DEVICES_DIR_PATH, "steam-deck");

export const STEAM_DECK_ROM_LISTS_DIR_PATH = path.resolve(STEAM_DECK_DIR_PATH, "lists");
export const STEAM_DECK_ROM_DIFFS_DIR_PATH = path.resolve(STEAM_DECK_DIR_PATH, "diffs");
export const STEAM_DECK_ROM_FAILED_DIR_PATH = path.resolve(STEAM_DECK_DIR_PATH, "failed");

const ES_DE_LOCAL_DOWNLOADED_MEDIA_DIR_PATH = "/media/alejandro/3tb-ssd/home/alejandro/pictures/gaming/emulation/es-de/downloaded-media";

export const ES_DE_LOCAL_TITLESCREENS_DIR_PATH = path.resolve(ES_DE_LOCAL_DOWNLOADED_MEDIA_DIR_PATH, "titlescreens");
export const ES_DE_LOCAL_SCREENSHOTS_DIR_PATH = path.resolve(ES_DE_LOCAL_DOWNLOADED_MEDIA_DIR_PATH, "screenshots");
export const ES_DE_LOCAL_MIXIMAGES_DIR_PATH = path.resolve(ES_DE_LOCAL_DOWNLOADED_MEDIA_DIR_PATH, "miximages");
export const ES_DE_LOCAL_MARQUEES_DIR_PATH = path.resolve(ES_DE_LOCAL_DOWNLOADED_MEDIA_DIR_PATH, "marquees");
export const ES_DE_LOCAL_COVERS_DIR_PATH = path.resolve(ES_DE_LOCAL_DOWNLOADED_MEDIA_DIR_PATH, "covers");
export const ES_DE_LOCAL_3D_BOXES_DIR_PATH = path.resolve(ES_DE_LOCAL_DOWNLOADED_MEDIA_DIR_PATH, "3dboxes");
export const ES_DE_LOCAL_PHYSICAL_MEDIA_DIR_PATH = path.resolve(ES_DE_LOCAL_DOWNLOADED_MEDIA_DIR_PATH, "physicalmedia");
export const ES_DE_LOCAL_BACK_COVERS_DIR_PATH = path.resolve(ES_DE_LOCAL_DOWNLOADED_MEDIA_DIR_PATH, "backcovers");
export const ES_DE_LOCAL_MANUALS_DIR_PATH = path.resolve(ES_DE_LOCAL_DOWNLOADED_MEDIA_DIR_PATH, "manuals");

const ES_DE_STEAM_DECK_REMOTE_DOWNLOADED_MEDIA_DIR_PATH = "/home/deck/Emulation/tools/downloaded_media";

export const ES_DE_STEAM_DECK_REMOTE_TITLESCREENS_DIR_PATH = path.resolve(ES_DE_STEAM_DECK_REMOTE_DOWNLOADED_MEDIA_DIR_PATH, "titlescreens");
export const ES_DE_STEAM_DECK_REMOTE_SCREENSHOTS_DIR_PATH = path.resolve(ES_DE_STEAM_DECK_REMOTE_DOWNLOADED_MEDIA_DIR_PATH, "screenshots");
export const ES_DE_STEAM_DECK_REMOTE_MIXIMAGES_DIR_PATH = path.resolve(ES_DE_STEAM_DECK_REMOTE_DOWNLOADED_MEDIA_DIR_PATH, "miximages");
export const ES_DE_STEAM_DECK_REMOTE_MARQUEES_DIR_PATH = path.resolve(ES_DE_STEAM_DECK_REMOTE_DOWNLOADED_MEDIA_DIR_PATH, "marquees");
export const ES_DE_STEAM_DECK_REMOTE_COVERS_DIR_PATH = path.resolve(ES_DE_STEAM_DECK_REMOTE_DOWNLOADED_MEDIA_DIR_PATH, "covers");
export const ES_DE_STEAM_DECK_REMOTE_3D_BOXES_DIR_PATH = path.resolve(ES_DE_STEAM_DECK_REMOTE_DOWNLOADED_MEDIA_DIR_PATH, "3dboxes");
export const ES_DE_STEAM_DECK_REMOTE_PHYSICAL_MEDIA_DIR_PATH = path.resolve(ES_DE_STEAM_DECK_REMOTE_DOWNLOADED_MEDIA_DIR_PATH, "physicalmedia");
export const ES_DE_STEAM_DECK_REMOTE_BACK_COVERS_DIR_PATH = path.resolve(ES_DE_STEAM_DECK_REMOTE_DOWNLOADED_MEDIA_DIR_PATH, "backcovers");
export const ES_DE_STEAM_DECK_REMOTE_MANUALS_DIR_PATH = path.resolve(ES_DE_STEAM_DECK_REMOTE_DOWNLOADED_MEDIA_DIR_PATH, "manuals");
