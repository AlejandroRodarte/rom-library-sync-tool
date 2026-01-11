import { VALID_LOG_LEVELS } from "../constants/valid-log-levels.constant.js";
import type { LogLevel } from "../types.js";

class Logger {
  private _logLevel: LogLevel;
  private _shouldPrintTraceLog: boolean;
  private _shouldPrintDebugLog: boolean;
  private _shouldPrintInfoLog: boolean;
  private _shouldPrintWarnLog: boolean;
  private _shouldPrintErrorLog: boolean;
  private _shouldPrintFatalLog: boolean;

  constructor(logLevel: LogLevel) {
    this._logLevel = logLevel;
    this._shouldPrintTraceLog = VALID_LOG_LEVELS.TRACE.includes(this._logLevel);
    this._shouldPrintDebugLog = VALID_LOG_LEVELS.DEBUG.includes(this._logLevel);
    this._shouldPrintInfoLog = VALID_LOG_LEVELS.INFO.includes(this._logLevel);
    this._shouldPrintWarnLog = VALID_LOG_LEVELS.WARN.includes(this._logLevel);
    this._shouldPrintErrorLog = VALID_LOG_LEVELS.ERROR.includes(this._logLevel);
    this._shouldPrintFatalLog = VALID_LOG_LEVELS.FATAL.includes(this._logLevel);
  }

  public trace(msg: string): void {
    if (this._shouldPrintTraceLog)
      console.log("\x1b[37m%s\x1b[0m", `[TRACE]: ${msg}`);
  }

  public debug(msg: string): void {
    if (this._shouldPrintDebugLog)
      console.log("\x1b[90m%s\x1b[0m", `[DEBUG]: ${msg}`);
  }

  public info(msg: string): void {
    if (this._shouldPrintInfoLog)
      console.log("\x1b[36m%s\x1b[0m", `[INFO]: ${msg}`);
  }

  public warn(msg: string): void {
    if (this._shouldPrintWarnLog)
      console.log("\x1b[33m%s\x1b[0m", `[WARN]: ${msg}`);
  }

  public error(msg: string): void {
    if (this._shouldPrintErrorLog)
      console.log("\x1b[35m%s\x1b[0m", `[ERROR]: ${msg}`);
  }

  public fatal(msg: string): void {
    if (this._shouldPrintFatalLog)
      console.log("\x1b[31m%s\x1b[0m", `[FATAL]: ${msg}`);
  }
}

export default Logger;
