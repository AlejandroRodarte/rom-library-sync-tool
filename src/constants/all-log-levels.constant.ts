import {
  ALL,
  DEBUG,
  ERROR,
  FATAL,
  INFO,
  OFF,
  TRACE,
  WARN,
} from "./log-levels.constants.js";

const ALL_LOG_LEVELS = [
  ALL,
  TRACE,
  DEBUG,
  INFO,
  WARN,
  ERROR,
  FATAL,
  OFF,
] as const;

export default ALL_LOG_LEVELS;
