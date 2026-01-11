import ALL_LOG_LEVELS from "../../../constants/all-log-levels.constant.js";
import type { LogLevel } from "../../../types.js";

const isLogLevel = (level: string): level is LogLevel =>
  ALL_LOG_LEVELS.includes(level as LogLevel);

export default isLogLevel;
