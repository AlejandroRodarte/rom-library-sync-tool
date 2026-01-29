import buildConsolesSkipFlags from "../helpers/classes/devices/alejandro-g751jt/build-consoles-skip-flags.helper.js";
import type { AlejandroG751JTConsolesSkipFlags } from "../interfaces/devices/alejandro-g751jt/alejandro-g751jt-consoles-skip-flags.interface.js";
import type { MediaName } from "../types/media-name.type.js";

class ConsoleMetadata {
  private _mediaNames: MediaName[];
  private _skipFlags: AlejandroG751JTConsolesSkipFlags;

  constructor(mediaNames: MediaName[]) {
    this._mediaNames = [...new Set(mediaNames)];
    this._skipFlags = buildConsolesSkipFlags(this._mediaNames);
  }

  get mediaNames(): MediaName[] {
    return this._mediaNames;
  }

  public skipGlobal(): void {
    this._skipFlags.global = true;
    this._skipFlags.list.global = true;
    this._skipFlags.diff.global = true;
    this._skipFlags.sync.global = true;
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
    this._skipFlags.list["content-targets"].roms = true;
  }

  public skipDiffRoms(): void {
    this._skipFlags.diff["content-targets"].roms = true;
  }

  public skipSyncRoms(): void {
    this._skipFlags.sync["content-targets"].roms = true;
  }

  public skipListMediaName(mediaName: MediaName): void {
    const mediaNameFlags = this._skipFlags.list["content-targets"].media.names;
    if (typeof mediaNameFlags[mediaName] === "boolean")
      mediaNameFlags[mediaName] = true;
  }

  public skipDiffMediaName(mediaName: MediaName): void {
    const mediaNameFlags = this._skipFlags.diff["content-targets"].media.names;
    if (typeof mediaNameFlags[mediaName] === "boolean")
      mediaNameFlags[mediaName] = true;
  }

  public skipSyncMediaName(mediaName: MediaName): void {
    const mediaNameFlags = this._skipFlags.sync["content-targets"].media.names;
    if (typeof mediaNameFlags[mediaName] === "boolean")
      mediaNameFlags[mediaName] = true;
  }

  public skipListEsDeGamelist(): void {
    this._skipFlags.list["content-targets"]["es-de-gamelists"] = true;
  }

  public skipDiffEsDeGamelist(): void {
    this._skipFlags.diff["content-targets"]["es-de-gamelists"] = true;
  }

  public skipSyncEsDeGamelist(): void {
    this._skipFlags.sync["content-targets"]["es-de-gamelists"] = true;
  }

  public canList(): boolean {
    return !this._skipFlags.global && !this._skipFlags.list.global;
  }

  public canDiff(): boolean {
    return !this._skipFlags.global && !this._skipFlags.diff.global;
  }

  public canSync(): boolean {
    return !this._skipFlags.global && !this._skipFlags.sync.global;
  }

  public canListRoms(): boolean {
    return this.canList() && !this._skipFlags.list["content-targets"].roms;
  }

  public canListMediaName(mediaName: MediaName): boolean {
    return (
      this.canList() &&
      typeof this._skipFlags.list["content-targets"].media.names[mediaName] ===
        "boolean" &&
      !this._skipFlags.list["content-targets"].media.names[mediaName]
    );
  }

  public canListEsDeGamelist(): boolean {
    return (
      this.canList() &&
      !this._skipFlags.list["content-targets"]["es-de-gamelists"]
    );
  }

  public canDiffRoms(): boolean {
    return this.canDiff() && !this._skipFlags.diff["content-targets"].roms;
  }

  public canDiffMediaName(mediaName: MediaName): boolean {
    return (
      this.canDiff() &&
      typeof this._skipFlags.diff["content-targets"].media.names[mediaName] ===
        "boolean" &&
      !this._skipFlags.diff["content-targets"].media.names[mediaName]
    );
  }

  public canDiffEsDeGamelist(): boolean {
    return (
      this.canDiff() &&
      !this._skipFlags.diff["content-targets"]["es-de-gamelists"]
    );
  }

  public canSyncRoms(): boolean {
    return this.canSync() && !this._skipFlags.list["content-targets"].roms;
  }

  public canSyncMediaName(mediaName: MediaName): boolean {
    return (
      this.canSync() &&
      typeof this._skipFlags.sync["content-targets"].media.names[mediaName] ===
        "boolean" &&
      !this._skipFlags.sync["content-targets"].media.names[mediaName]
    );
  }

  public canSyncEsDeGamelist(): boolean {
    return (
      this.canSync() &&
      !this._skipFlags.sync["content-targets"]["es-de-gamelists"]
    );
  }
}

export default ConsoleMetadata;
