import chalk from "chalk";
import { VALID_LOG_LEVELS } from "../constants/valid-log-levels.constant.js";
import type { LogLevel } from "../types/log-level.type.js";

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

  public trace(...msgs: string[]): void {
    if (this._shouldPrintTraceLog)
      for (const msg of msgs) console.log(chalk.white(`[TRACE]: ${msg}`));
  }

  public debug(...msgs: string[]): void {
    if (this._shouldPrintDebugLog)
      for (const msg of msgs) console.log(chalk.cyan(`[DEBUG]: ${msg}`));
  }

  public info(...msgs: string[]): void {
    if (this._shouldPrintInfoLog)
      for (const msg of msgs)
        console.log(chalk.rgb(130, 200, 229)(`[INFO]: ${msg}`));
  }

  public warn(...msgs: string[]): void {
    if (this._shouldPrintWarnLog)
      for (const msg of msgs) console.log(chalk.yellow(`[WARN]: ${msg}`));
  }

  public error(...msgs: string[]): void {
    if (this._shouldPrintErrorLog)
      for (const msg of msgs)
        console.log(chalk.rgb(255, 127, 0)(`[ERROR]: ${msg}`));
  }

  public fatal(...msgs: string[]): void {
    if (this._shouldPrintFatalLog)
      for (const msg of msgs) console.log(chalk.red(`[FATAL]: ${msg}`));
  }
}

export default Logger;
