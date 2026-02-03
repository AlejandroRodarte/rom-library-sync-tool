import dotEnv from "dotenv";
import type { Environment } from "../interfaces/environment.interface.js";
import buildEnvironment from "../helpers/build/environment.helper.js";

dotEnv.config();
const environment: Environment = buildEnvironment();
console.log(JSON.stringify(environment, undefined, 2));

export default environment;
