class DeviceContentTargetsSkipFlags {
  private _global: boolean;
  private _roms: boolean;
  private _media: boolean;
  private _esDeGamelists: boolean;

  public constructor() {
    this._global = false;
    this._roms = false;
    this._media = false;
    this._esDeGamelists = false;
  }

  public skipAllContentTargets(): void {
    this._global = true;
  }

  public skipRoms(): void {
    this._roms = true;
  }

  public skipMedia(): void {
    this._media = true;
  }

  public skipEsDeGamelists(): void {
    this._esDeGamelists = true;
  }

  public canProcessRoms(): boolean {
    return !this._global && !this._roms;
  }

  public canProcessMedia(): boolean {
    return !this._global && !this._media;
  }

  public canProcessEsDeGamelists(): boolean {
    return !this._global && !this._esDeGamelists;
  }

  public canProcessAllContentTargets(): boolean {
    return !this._global && !this._roms && !this._media && !this._esDeGamelists;
  }

  public isDeviceBanned(): boolean {
    return this._global || (this._roms && this._media && this._esDeGamelists);
  }
}

export default DeviceContentTargetsSkipFlags;
