import path from "node:path";

const DATA_DIR_PATH = path.resolve(process.env.PWD || __dirname, "data");

export const DEVICES_DIR_PATH = path.join(DATA_DIR_PATH, "devices");
