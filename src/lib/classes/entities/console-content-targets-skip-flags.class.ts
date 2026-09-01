import ALL_MEDIA_NAMES from "../../constants/media/all-media-names.constant.js";
import type { MediaName } from "../../types/media/media-name.type.js";

interface MediaFlags {
  global: boolean;
  names: Map<MediaName, boolean>;
}

class ConsoleContentTargetsSkipFlags {
  private _global: boolean;
  private _roms: boolean;
  private _media: MediaFlags;
  private _esDeGamelists: boolean;

  public constructor(mediaNames: MediaName[] = [...ALL_MEDIA_NAMES]) {
    this._global = false;
    this._roms = false;

    this._media = {
      global: false,
      names: new Map(mediaNames.map((m) => [m, false])),
    };

    this._esDeGamelists = false;
  }

  public skipAllContentTargets(): void {
    this._global = true;
  }

  public skipRoms(): void {
    this._roms = true;
  }

  public skipAllMediaNames(): void {
    this._media.global = true;
  }

  public skipMediaName(mediaName: MediaName): void {
    if (this._media.names.has(mediaName))
      this._media.names.set(mediaName, true);
  }

  public skipEsDeGamelists(): void {
    this._esDeGamelists = true;
  }

  public canProcessRoms(): boolean {
    return !this._global && !this._roms;
  }

  public canProcessMediaName(mediaName: MediaName): boolean {
    return (
      this.canGenerallyProcessMedia() &&
      this.canGenerallyProcessMediaName(mediaName)
    );
  }

  public canProcessAllMediaNames(): boolean {
    const mediaFlags = [
      this.canGenerallyProcessMedia(),
      ...this._media.names
        .keys()
        .map((m) => this.canGenerallyProcessMediaName(m)),
    ];
    return mediaFlags.every((f) => f === true);
  }

  public canProcessEsDeGamelist(): boolean {
    return !this._global && !this._esDeGamelists;
  }

  public canProcessAllContentTargets(): boolean {
    return (
      this.canProcessRoms() &&
      this.canProcessAllMediaNames() &&
      this.canProcessEsDeGamelist()
    );
  }

  private canGenerallyProcessMedia(): boolean {
    return !this._global && !this._media.global;
  }

  private canGenerallyProcessMediaName(mediaName: MediaName): boolean {
    const mediaNameSkipFlag = this._media.names.get(mediaName);
    if (typeof mediaNameSkipFlag === "undefined") return false;
    return !mediaNameSkipFlag;
  }
}

export default ConsoleContentTargetsSkipFlags;
