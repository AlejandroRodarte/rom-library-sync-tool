import Logger from "../classes/logger.class.js";
import ENVIRONMENT from "../constants/environment.constant.js";

const logger = new Logger(ENVIRONMENT.options.log.level);

export default logger;
