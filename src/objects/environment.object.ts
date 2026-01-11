import dotEnv from "dotenv";
import environmentFromProcessVariables from "../helpers/build/environment-from-process-variables.helper.js";
import type { Environment } from "../types.js";

dotEnv.config();
const environment: Environment = environmentFromProcessVariables();

export default environment;
