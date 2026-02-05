import type { Rom } from "../../interfaces/roms/rom.interface.js";
import type { RomsSpecialFlags } from "../../interfaces/roms/roms-special-flags.interface.js";
import Roms from "./roms.class.js";

class Title {
  private _name: string;

  private _allRoms: Roms;
  private _selectedRoms: Roms;

  private _keepSelected = 1;

  constructor(name: string, roms: Roms) {
    this._name = name;
    this._allRoms = roms;
    this._selectedRoms = new Roms();
  }

  get name(): string {
    return this._name;
  }

  get allRoms(): Roms {
    return this._allRoms;
  }

  get selectedRoms(): Roms {
    return this._selectedRoms;
  }

  get selectedRomsSize(): number {
    return this.selectedRoms.size;
  }

  set keepSelected(keepSelected: number) {
    this._keepSelected = keepSelected;
  }

  public addRom(rom: Rom, selected = true): void {
    this._allRoms.add(rom);
    if (selected) this._selectedRoms.add(rom);
  }

  public unselectOne(
    id: string,
  ): "cant-unselect" | "rom-existed" | "rom-did-not-exist" {
    if (!this.canUnselect()) return "cant-unselect";
    const romExisted = this.selectedRoms.deleteOne(id);
    return romExisted ? "rom-existed" : "rom-did-not-exist";
  }

  public unselectMany(ids: string[]): void {
    for (const id of ids) {
      const result = this.unselectOne(id);
      switch (result) {
        case "cant-unselect":
          return;
        case "rom-existed":
          if (!this.canUnselect()) return;
          break;
        case "rom-did-not-exist":
          break;
      }
    }
  }

  public getSpecialFlags(from: "all" | "selected" = "selected"): RomsSpecialFlags {
    switch (from) {
      case "all":
        return this._allRoms.specialFlags;
      case "selected":
        return this._selectedRoms.specialFlags;
    }
  }

  public canUnselect(): boolean {
    return this.selectedRomsSize > this._keepSelected;
  }
}

export default Title;
