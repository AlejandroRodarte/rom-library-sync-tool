import type { Rom } from "../../interfaces/roms/rom.interface.js";
import type { RomsSpecialFlags } from "../../interfaces/roms/roms-special-flags.interface.js";
import Roms from "./roms.class.js";

interface UnselectOneMethodOpts {
  force?: boolean;
}

type UnselectManyMethodOpts = UnselectOneMethodOpts;
type SelectOneMethodOpts = UnselectOneMethodOpts;
type SelectManyMethodOpts = UnselectOneMethodOpts;

class Title {
  private _name: string;

  private _allRoms: Roms;
  private _selectedRoms: Roms;

  private _keepSelected = 1;

  constructor(name: string) {
    this._name = name;
    this._allRoms = new Roms();
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
    opts?: UnselectOneMethodOpts,
  ): "cant-unselect" | "rom-deleted" | "rom-did-not-exist" {
    const unselectOneMethodOpts: Required<UnselectOneMethodOpts> = {
      force: false,
    };

    if (opts) if (opts.force) unselectOneMethodOpts.force = opts.force;

    const canUnselectBeforeDeleting = this.canUnselect();

    if (!unselectOneMethodOpts.force && !canUnselectBeforeDeleting)
      return "cant-unselect";

    const romExisted = this.selectedRoms.deleteOne(id);
    if (!romExisted) return "rom-did-not-exist";

    if (unselectOneMethodOpts.force && !canUnselectBeforeDeleting)
      this._keepSelected--;

    return "rom-deleted";
  }

  public selectOne(
    id: string,
    opts?: SelectOneMethodOpts,
  ):
    | "cant-select"
    | "rom-added"
    | "rom-did-not-exist"
    | "rom-already-selected" {
    const selectOneMethodOpts: Required<SelectOneMethodOpts> = {
      force: false,
    };

    if (opts) if (opts.force) selectOneMethodOpts.force = opts.force;

    const canSelectBeforeMutating = !this.canSelect();

    if (!selectOneMethodOpts.force && !canSelectBeforeMutating)
      return "cant-select";

    const romToSelect = this.allRoms.get(id);
    const romExistsInAllRomsSet = typeof romToSelect !== "undefined";

    if (!romExistsInAllRomsSet) return "rom-did-not-exist";

    const romIsAlreadySelected = this.selectedRoms.has(id);
    if (romIsAlreadySelected) return "rom-already-selected";

    this.selectedRoms.add(romToSelect);

    if (selectOneMethodOpts.force && !canSelectBeforeMutating)
      this._keepSelected++;

    return "rom-added";
  }

  public unselectMany(ids: string[], opts?: UnselectManyMethodOpts): void {
    const unselectManyMethodOpts: Required<UnselectManyMethodOpts> = {
      force: false,
    };

    if (opts) if (opts.force) unselectManyMethodOpts.force = opts.force;

    for (const id of ids) {
      const result = this.unselectOne(id, unselectManyMethodOpts);
      switch (result) {
        case "cant-unselect":
          return;
        case "rom-deleted":
          if (!unselectManyMethodOpts.force && !this.canUnselect()) return;
          break;
        case "rom-did-not-exist":
          break;
      }
    }
  }

  public selectMany(ids: string[], opts?: SelectManyMethodOpts): void {
    const selectManyMethodOpts: Required<SelectManyMethodOpts> = {
      force: false,
    };

    if (opts) if (opts.force) selectManyMethodOpts.force = opts.force;

    for (const id of ids) {
      const result = this.selectOne(id, selectManyMethodOpts);
      switch (result) {
        case "cant-select":
          return;
        case "rom-added":
          if (!selectManyMethodOpts.force && !this.canSelect()) return;
        case "rom-did-not-exist":
        case "rom-already-selected":
          break;
      }
    }
  }

  public ban() {
    this._keepSelected = 0;
    this._selectedRoms.clear();
  }

  public getSpecialFlags(
    from: "all" | "selected" = "selected",
  ): RomsSpecialFlags {
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

  public canSelect(): boolean {
    return this.selectedRomsSize < this._keepSelected;
  }
}

export default Title;
