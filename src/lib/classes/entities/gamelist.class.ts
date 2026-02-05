import xml2Js from "xml2js";
import type { EsDeGamelistItem } from "../../types/es-de-gamelists/es-de-gamelist-item.type.js";
import buildObject, { type BuildObjectError } from "../../helpers/wrappers/modules/xml2js/build-object.helper.js";

export type XmlMethodError = BuildObjectError;

class Gamelist {
  private _games: Map<string, EsDeGamelistItem>;
  private _folders: Map<string, EsDeGamelistItem>;

  constructor() {
    this._games = new Map();
    this._folders = new Map();
  }

  get gameEntries() {
    return this._games.entries();
  }

  get folderEntries() {
    return this._folders.entries();
  }

  public hasGame(romFilename: string): boolean {
    return this._games.has(romFilename);
  }

  public hasFolder(romDirname: string): boolean {
    return this._folders.has(romDirname);
  }

  public addGame(
    romFilename: string,
    esDeGamelistItem: EsDeGamelistItem,
  ): void {
    this._games.set(romFilename, esDeGamelistItem);
  }

  public addGames(entries: [string, EsDeGamelistItem][]): void {
    entries.forEach(([romFilename, esDeGamelistItem]) =>
      this.addGame(romFilename, esDeGamelistItem),
    );
  }

  public addFolder(
    romDirname: string,
    esDeGamelistItem: EsDeGamelistItem,
  ): void {
    this._folders.set(romDirname, esDeGamelistItem);
  }

  public addFolders(entries: [string, EsDeGamelistItem][]): void {
    entries.forEach(([romFilename, esDeGamelistItem]) =>
      this.addFolder(romFilename, esDeGamelistItem),
    );
  }

  public xml(
    rootName: string = "gameList",
  ): [string, undefined] | [undefined, XmlMethodError] {
    const builder = new xml2Js.Builder({ rootName });

    const [serializedGamelist, serializationError] = buildObject(builder, {
      game: this._games.values().toArray(),
      folder: this._folders.values().toArray(),
    });

    if (serializationError) return [undefined, serializationError];
    return [serializedGamelist, undefined];
  }
}

export default Gamelist;
