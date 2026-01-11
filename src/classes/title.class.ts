import { v7 } from "uuid";

import AppNotFoundError from "./errors/app-not-found-error.class.js";
import specialFlagsFromRoms from "../helpers/build/special-flags-from-roms.helper.js";
import type { RomSet } from "../types/rom-set.type.js";
import type { Rom } from "../interfaces/rom.interface.js";
import type { SpecialFlags } from "../interfaces/special-flags.interface.js";

const build = {
  specialFlagsFromRoms,
};

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
    if (!this._selectedRomSet)
      throw new AppNotFoundError(
        "The set for selected ROMs has not been initialized. Make sure to call setSelectedRomSet() after you are done adding all of the ROMs for a given title.",
      );
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

  public getSpecialFlags(
    from: "roms" | "selected-roms" = "selected-roms",
  ): SpecialFlags {
    switch (from) {
      case "roms":
        return this.computeSpecialFlags(this._romSet);
      case "selected-roms":
        return this.computeSpecialFlags(this.selectedRomSet);
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
