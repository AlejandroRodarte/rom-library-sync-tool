import path from "node:path";
import type {
  ConsoleName,
  Consoles,
  DeviceDirPaths,
  DeviceName,
} from "../types.js";
import { DEVICES_DIR_PATH } from "../constants/paths.constants.js";
import AppNotFoundError from "./errors/app-not-found-error.class.js";
import AppEntryExistsError from "./errors/app-entry-exists-error.class.js";
import Console from "./console.class.js";
import type { AllDirsExistAndAreReadableAndWritableError } from "../helpers/file-io/all-dirs-exist-and-are-readable-and-writable.helper.js";
import build from "../helpers/build/index.js";
import ENVIRONMENT from "../constants/environment.constant.js";
import devices from "../helpers/devices/index.js";

export type AddConsoleMethodError = AppNotFoundError | AppEntryExistsError;
export type AllPathsAreValidMethodError =
  AllDirsExistAndAreReadableAndWritableError;

class Device {
  private _name: DeviceName;
  private _paths: DeviceDirPaths;
  private _consoleNames: ConsoleName[];
  private _consoles: Consoles;

  constructor(name: DeviceName, consoleNames: ConsoleName[]) {
    this._name = name;

    const uniqueConsoleNames = [...new Set(consoleNames)];
    this._consoleNames = uniqueConsoleNames;

    const basePath = path.join(DEVICES_DIR_PATH, this._name);
    this._paths = {
      base: basePath,
      lists: path.join(basePath, "lists"),
      diffs: path.join(basePath, "diffs"),
      failed: path.join(basePath, "failed"),
    };

    this._consoles = new Map<string, Console>();
    for (const consoleName of this._consoleNames)
      this.addConsole(consoleName, new Console(consoleName));
  }

  get name() {
    return this._name;
  }

  get paths() {
    return this._paths;
  }

  get consoles() {
    return this._consoles;
  }

  public addConsole(
    consoleName: ConsoleName,
    konsole: Console,
  ): AddConsoleMethodError | undefined {
    if (!this._consoleNames.includes(consoleName))
      return new AppNotFoundError(
        `Device ${this._name} is NOT related to console ${consoleName}. This device supports the following consoles: ${this._consoleNames.join(", ")}.`,
      );

    const consoleExists = this._consoles.has(consoleName);
    if (consoleExists)
      return new AppEntryExistsError(
        `There is already an entry for console ${consoleName}.`,
      );

    this._consoles.set(consoleName, konsole);
  }

  public async populateConsoles() {
    for (const [consoleName, konsole] of this._consoles) {
      const titles = await build.titlesFromConsoleName(consoleName);
      for (const [titleName, title] of titles)
        konsole.addTitle(titleName, title);
    }
  }

  public updateConsolesMetadata() {
    for (const [_, konsole] of this._consoles) {
      konsole.updateScrappedTitles();
      konsole.updateSelectedTitles();
      konsole.updateSelectedRoms();
    }
  }

  public async sync() {
    switch (this._name) {
      case "local":
        if (!ENVIRONMENT.devices.local.sync) break;
        await devices.syncLocal(this);
        break;
      case "steam-deck":
        if (!ENVIRONMENT.devices.steamDeck.sync) break;
        await devices.syncSteamDeck(this);
        break;
    }
  }
}

export default Device;
