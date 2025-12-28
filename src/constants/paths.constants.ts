import path from "node:path";

export const ROMS_DIR_PATH = "/home/alejandro/Downloads/myrient";
export const DATA_DIR_PATH = path.resolve(process.env.PWD || __dirname, "data");
