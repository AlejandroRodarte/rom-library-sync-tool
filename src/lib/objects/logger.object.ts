import environment from "./environment.object.js";
import Logger from "../classes/logger.class.js";

const logger = new Logger(environment.options.log.level);

export default logger;
