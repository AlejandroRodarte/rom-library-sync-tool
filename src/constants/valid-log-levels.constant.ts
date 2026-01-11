import type { LogLevel } from "../types.js";
import ALL_LOG_LEVELS from "./all-log-levels.constant.js";

type ValidLogLevels = Omit<
  {
    [K in LogLevel]: readonly LogLevel[];
  },
  "ALL" | "OFF"
>;

export const VALID_LOG_LEVELS: ValidLogLevels = {
  // ['ALL', 'TRACE']
  TRACE: ALL_LOG_LEVELS.slice(
    0,
    ALL_LOG_LEVELS.findIndex((l) => l === "TRACE") + 1,
  ),
  // ['ALL', 'TRACE', 'DEBUG']
  DEBUG: ALL_LOG_LEVELS.slice(
    0,
    ALL_LOG_LEVELS.findIndex((l) => l === "DEBUG") + 1,
  ),
  // ['ALL', 'TRACE', 'DEBUG', 'INFO']
  INFO: ALL_LOG_LEVELS.slice(
    0,
    ALL_LOG_LEVELS.findIndex((l) => l === "INFO") + 1,
  ),
  // ['ALL', 'TRACE', 'DEBUG', 'INFO', 'WARN']
  WARN: ALL_LOG_LEVELS.slice(
    0,
    ALL_LOG_LEVELS.findIndex((l) => l === "WARN") + 1,
  ),
  // ['ALL', 'TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR']
  ERROR: ALL_LOG_LEVELS.slice(
    0,
    ALL_LOG_LEVELS.findIndex((l) => l === "ERROR") + 1,
  ),
  // ['ALL', 'TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']
  FATAL: ALL_LOG_LEVELS.slice(
    0,
    ALL_LOG_LEVELS.findIndex((l) => l === "FATAL") + 1,
  ),
};
