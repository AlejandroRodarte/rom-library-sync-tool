import dotEnv from "dotenv";
import build from "../helpers/build/index.js";

dotEnv.config();
const ENVIRONMENT = build.environmentFromProcessVariables();

export default ENVIRONMENT;
