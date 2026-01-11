import dotEnv from "dotenv";
import environmentFromProcessVariables from "../helpers/build/environment-from-process-variables.helper.js";
import type { Environment } from "../interfaces/environment.interface.js";

dotEnv.config();
const environment: Environment = environmentFromProcessVariables();

export default environment;
