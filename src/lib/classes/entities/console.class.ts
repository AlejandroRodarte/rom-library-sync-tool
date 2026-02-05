import type { ConsoleName } from "../../types/consoles/console-name.type.js";
import type { Media } from "../../types/media/media.type.js";
import type ConsoleMetadata from "./console-metadata.class.js";
import Gamelist from "./gamelist.class.js";
import Games from "./games.class.js";

class Console {
  private _name: ConsoleName;
  private _metadata: ConsoleMetadata;
  private _games: Games;
  private _media: Media;
  private _gamelist: Gamelist;

  constructor(name: ConsoleName, metadata: ConsoleMetadata) {
    this._name = name;
    this._metadata = metadata;
    this._games = new Games(new Map());
    this._media = new Map();
    this._gamelist = new Gamelist();
  }

  get name() {
    return this._name;
  }

  get metadata() {
    return this._metadata;
  }

  get games() {
    return this._games;
  }

  get medias() {
    return this._media;
  }

  get gamelist() {
    return this._gamelist;
  }

  get report(): string {
    let content = `***** Report for console ${this._name} *****\n`;
    content += `Titles with 0 selections: ${this._games.scrappedTitles.size}.\n`;

    for (const [romsSelected, titles] of this._games.selectedTitles)
      content += `Titles with ${romsSelected} selections: ${titles.size}.\n`;

    return content;
  }
}

export default Console;
