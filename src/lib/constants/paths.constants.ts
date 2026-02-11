import path from "node:path";
import dotEnv from "dotenv";
import validation from "../helpers/validation/index.js";
import AppValidationError from "../classes/errors/app-validation-error.class.js";

dotEnv.config();

const rawDataDirPath = process.env.DATA_DIR_PATH || __dirname;
if (!validation.isStringAbsoluteUnixPath(rawDataDirPath))
  throw new AppValidationError(`We need DATA_DIR_PATH to be an absolute Unix path.`)

export const DATA_DIR_PATH = process.env.DATA_DIR_PATH || __dirname;
export const DEVICES_DIR_PATH = path.join(DATA_DIR_PATH, "devices");

console.log("DEVICES_DIR_PATH: ", DEVICES_DIR_PATH);
