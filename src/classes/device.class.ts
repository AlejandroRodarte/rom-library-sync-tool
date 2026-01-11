import path from "node:path";

import Console from "./console.class.js";
import { DEVICES_DIR_PATH } from "../constants/paths.constants.js";
import AppNotFoundError from "./errors/app-not-found-error.class.js";
import AppEntryExistsError from "./errors/app-entry-exists-error.class.js";
import logger from "../objects/logger.object.js";
import environment from "../objects/environment.object.js";
import titlesFromRomsDirPath from "../helpers/build/titles-from-roms-dir-path.helper.js";
import syncLocal from "../helpers/devices/sync-local.helper.js";
import syncSteamDeck from "../helpers/devices/sync-steam-deck.helper.js";
import type { AllDirsExistAndAreReadableAndWritableError } from "../helpers/file-io/all-dirs-exist-and-are-readable-and-writable.helper.js";
import type { DeviceName } from "../types/device-name.type.js";
import type { DeviceDirPaths } from "../interfaces/device-dir-paths.interface.js";
import type { ConsoleName } from "../types/console-name.type.js";
import type { Consoles } from "../types/consoles.type.js";

const build = {
  titlesFromRomsDirPath,
};

const devices = {
  syncLocal,
  syncSteamDeck,
};

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

    this._consoles = new Map<ConsoleName, Console>();
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
    return new Map(
      [...this._consoles.entries()].filter(([_, konsole]) => !konsole.skipped),
    );
  }

  get pathsList(): string[] {
    return [
      this._paths.base,
      this._paths.diffs,
      this._paths.lists,
      this._paths.failed,
    ];
  }

  get consolesFailedFilePaths(): string[] {
    return this._consoles
      .keys()
      .map((cn) => path.join(this._paths.failed, `${cn}.failed.txt`))
      .toArray();
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
      const [titles, buildTitlesError] = await build.titlesFromRomsDirPath(
        konsole.dbPaths.roms,
      );

      if (buildTitlesError) {
        logger.warn(
          `Error while reading database ROM directory for console ${consoleName}.\n${buildTitlesError.toString()}\nWill skip this console. This means that NOTHING after this step will get processed.`,
        );
        konsole.skipped = true;
        continue;
      }

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
        if (!environment.devices.local.sync) break;
        await devices.syncLocal(this);
        break;
      case "steam-deck":
        if (!environment.devices["steam-deck"].sync) break;
        await devices.syncSteamDeck(this);
        break;
    }
  }
}

export default Device;
