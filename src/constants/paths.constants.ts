import path from "node:path";

export const ROMS_DIR_PATH =
  "/media/alejandro/3tb-ssd/home/alejandro/games/roms";
export const DATA_DIR_PATH = path.resolve(process.env.PWD || __dirname, "data");
