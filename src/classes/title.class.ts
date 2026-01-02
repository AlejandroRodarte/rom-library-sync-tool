import { v7 } from "uuid";
import type { Rom, RomSet, SpecialFlags } from "../types.js";
import build from "../helpers/build/index.js";

class Title {
  private _name: string;
  private _romSet: RomSet;
  private _selectedRomSet: RomSet | undefined;
  private _keepSelected = 1;

  constructor(name: string, romSet: RomSet) {
    this._name = name;
    this._romSet = romSet;
  }

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  get romSet(): RomSet {
    return this._romSet;
  }

  get selectedRomSet(): RomSet {
    if (!this._selectedRomSet) throw new Error("No selected ROM set");
    return this._selectedRomSet;
  }

  get selectedRomAmount(): number {
    return this.selectedRomSet.size;
  }

  set keepSelected(keepSelected: number) {
    this._keepSelected = keepSelected;
  }

  public addRom(rom: Rom): void {
    this._romSet.set(v7(), rom);
  }

  public setSelectedRomSet(): void {
    this._selectedRomSet = new Map(this._romSet);
  }

  public unselectByIds(ids: string[]): void {
    for (const id of ids) {
      const result = this.unselectById(id);
      switch (result) {
        case "cant-unselect":
          return;
        case "rom-existed":
          if (!this.canUnselect()) return;
          break;
        case "rom-did-not-exist":
          break;
        default:
          break;
      }
    }
  }

  public unselectById(
    id: string,
  ): "cant-unselect" | "rom-existed" | "rom-did-not-exist" {
    if (!this.canUnselect()) return "cant-unselect";
    const romExisted = this.selectedRomSet.delete(id);
    return romExisted ? "rom-existed" : "rom-did-not-exist";
  }

  public getSpecialFlags(from: "roms" | "selected-roms"): SpecialFlags {
    switch (from) {
      case "roms":
        return this.computeSpecialFlags(this._romSet);
      case "selected-roms":
        return this.computeSpecialFlags(this.selectedRomSet);
      default:
        throw new Error("Need a ROM set");
    }
  }

  public canUnselect(): boolean {
    return this.selectedRomAmount > this._keepSelected;
  }

  private computeSpecialFlags(romSet: RomSet): SpecialFlags {
    const roms = Array.from(romSet.values());
    return build.specialFlagsFromRoms(roms);
  }
}

export default Title;
