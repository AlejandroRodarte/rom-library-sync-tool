import buildModesSkipFlags from "../../helpers/build/skip-flags/build-modes-skip-flags.helper.js";
import type { ModesSkipFlags } from "../../interfaces/modes/modes-skip-flags.interface.js";
import type { MediaName } from "../../types/media/media-name.type.js";

class ConsoleMetadata {
  private _mediaNames: MediaName[];
  private _modesSkipFlags: ModesSkipFlags;

  constructor(mediaNames: MediaName[]) {
    this._mediaNames = [...new Set(mediaNames)];
    this._modesSkipFlags = buildModesSkipFlags(this._mediaNames);
  }

  get mediaNames(): MediaName[] {
    return this._mediaNames;
  }

  public skipGlobal(): void {
    this._modesSkipFlags.global = true;
    this._modesSkipFlags.list.global = true;
    this._modesSkipFlags.diff.global = true;
    this._modesSkipFlags.sync.global = true;
  }

  public skipGlobalRoms(): void {
    this.skipListRoms();
    this.skipDiffRoms();
    this.skipSyncRoms();
  }

  public skipGlobalMediaName(mediaName: MediaName): void {
    this.skipListMediaName(mediaName);
    this.skipDiffMediaName(mediaName);
    this.skipSyncMediaName(mediaName);
  }

  public skipGlobalEsDeGamelist(): void {
    this.skipListEsDeGamelist();
    this.skipDiffEsDeGamelist();
    this.skipSyncEsDeGamelist();
  }

  public skipListRoms(): void {
    this._modesSkipFlags.list["content-targets"].roms = true;
  }

  public skipDiffRoms(): void {
    this._modesSkipFlags.diff["content-targets"].roms = true;
  }

  public skipSyncRoms(): void {
    this._modesSkipFlags.sync["content-targets"].roms = true;
  }

  public skipListMediaName(mediaName: MediaName): void {
    const mediaNameFlags = this._modesSkipFlags.list["content-targets"].media.names;
    if (typeof mediaNameFlags[mediaName] === "boolean")
      mediaNameFlags[mediaName] = true;
  }

  public skipDiffMediaName(mediaName: MediaName): void {
    const mediaNameFlags = this._modesSkipFlags.diff["content-targets"].media.names;
    if (typeof mediaNameFlags[mediaName] === "boolean")
      mediaNameFlags[mediaName] = true;
  }

  public skipSyncMediaName(mediaName: MediaName): void {
    const mediaNameFlags = this._modesSkipFlags.sync["content-targets"].media.names;
    if (typeof mediaNameFlags[mediaName] === "boolean")
      mediaNameFlags[mediaName] = true;
  }

  public skipListEsDeGamelist(): void {
    this._modesSkipFlags.list["content-targets"]["es-de-gamelists"] = true;
  }

  public skipDiffEsDeGamelist(): void {
    this._modesSkipFlags.diff["content-targets"]["es-de-gamelists"] = true;
  }

  public skipSyncEsDeGamelist(): void {
    this._modesSkipFlags.sync["content-targets"]["es-de-gamelists"] = true;
  }

  public canList(): boolean {
    return !this._modesSkipFlags.global && !this._modesSkipFlags.list.global;
  }

  public canDiff(): boolean {
    return !this._modesSkipFlags.global && !this._modesSkipFlags.diff.global;
  }

  public canSync(): boolean {
    return !this._modesSkipFlags.global && !this._modesSkipFlags.sync.global;
  }

  public canListRoms(): boolean {
    return this.canList() && !this._modesSkipFlags.list["content-targets"].roms;
  }

  public canListMediaName(mediaName: MediaName): boolean {
    return (
      this.canList() &&
      typeof this._modesSkipFlags.list["content-targets"].media.names[mediaName] ===
        "boolean" &&
      !this._modesSkipFlags.list["content-targets"].media.names[mediaName]
    );
  }

  public canListEsDeGamelist(): boolean {
    return (
      this.canList() &&
      !this._modesSkipFlags.list["content-targets"]["es-de-gamelists"]
    );
  }

  public canDiffRoms(): boolean {
    return this.canDiff() && !this._modesSkipFlags.diff["content-targets"].roms;
  }

  public canDiffMediaName(mediaName: MediaName): boolean {
    return (
      this.canDiff() &&
      typeof this._modesSkipFlags.diff["content-targets"].media.names[mediaName] ===
        "boolean" &&
      !this._modesSkipFlags.diff["content-targets"].media.names[mediaName]
    );
  }

  public canDiffEsDeGamelist(): boolean {
    return (
      this.canDiff() &&
      !this._modesSkipFlags.diff["content-targets"]["es-de-gamelists"]
    );
  }

  public canSyncRoms(): boolean {
    return this.canSync() && !this._modesSkipFlags.list["content-targets"].roms;
  }

  public canSyncMediaName(mediaName: MediaName): boolean {
    return (
      this.canSync() &&
      typeof this._modesSkipFlags.sync["content-targets"].media.names[mediaName] ===
        "boolean" &&
      !this._modesSkipFlags.sync["content-targets"].media.names[mediaName]
    );
  }

  public canSyncEsDeGamelist(): boolean {
    return (
      this.canSync() &&
      !this._modesSkipFlags.sync["content-targets"]["es-de-gamelists"]
    );
  }
}

export default ConsoleMetadata;
