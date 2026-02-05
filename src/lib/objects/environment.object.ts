import dotEnv from "dotenv";
import type { Environment } from "../interfaces/env/environment.interface.js";
import buildEnvironment from "../helpers/build/env/environment.helper.js";

dotEnv.config();
const environment: Environment = buildEnvironment();

export default environment;
