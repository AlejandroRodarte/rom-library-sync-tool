import buildRomsSpecialFlagsFromRomList from "../../helpers/build/roms/build-roms-special-flags-from-rom-list.helper.js";
import type { Rom } from "../../interfaces/roms/rom.interface.js";
import type { RomsSpecialFlags } from "../../interfaces/roms/roms-special-flags.interface.js";

class Roms {
  private _roms: Map<string, Rom>;

  constructor() {
    this._roms = new Map();
  }

  get size() {
    return this._roms.size;
  }

  get entries() {
    return this._roms.entries();
  }

  get specialFlags(): RomsSpecialFlags {
    return buildRomsSpecialFlagsFromRomList(this._roms.values().toArray());
  }

  public get(id: string): Rom | undefined {
    return this._roms.get(id);
  }

  public add(rom: Rom): void {
    this._roms.set(rom.file.name, rom);
  }

  public deleteOne(id: string): boolean {
    return this._roms.delete(id);
  }

  public deleteMany(ids: string[]): number {
    let acc = 0;

    for (const id of ids) {
      const existed = this._roms.delete(id);
      if (existed) acc++;
    }

    return acc;
  }

  public clear(): void {
    return this._roms.clear();
  }
}

export default Roms;
