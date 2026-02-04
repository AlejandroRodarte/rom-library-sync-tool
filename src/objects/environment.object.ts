import dotEnv from "dotenv";
import type { Environment } from "../interfaces/environment.interface.js";
import buildEnvironment from "../helpers/build/environment.helper.js";

dotEnv.config();
const environment: Environment = buildEnvironment();

export default environment;
