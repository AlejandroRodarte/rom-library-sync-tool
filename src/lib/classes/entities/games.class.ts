import type { Titles } from "../../types/roms/titles.type.js";
import Roms from "./roms.class.js";
import type Title from "./title.class.js";

class Games {
  private _allTitles: Titles;

  private _scrappedTitles: Titles;
  private _selectedTitles: Map<number, Titles>;
  private _allRoms: Roms;
  private _selectedRoms: Roms;

  constructor(titles: Titles) {
    this._allTitles = titles;
    this._scrappedTitles = new Map();
    this._selectedTitles = new Map();
    this._allRoms = new Roms();
    this._selectedRoms = new Roms();
  }

  get scrappedTitles() {
    if (this._scrappedTitles.size === 0) this._populateScrappedTitles();
    return this._scrappedTitles;
  }

  get selectedTitles() {
    if (this._selectedTitles.size === 0) this._populateSelectedTitles();
    return this._selectedTitles;
  }

  get duplicateTitles() {
    const duplicates = new Map(this.selectedTitles);
    duplicates.delete(1);
    return duplicates;
  }

  get allRoms() {
    if (this._allRoms.size === 0) this._populateAllRoms();
    return this._allRoms;
  }

  get selectedRoms() {
    if (this._selectedRoms.size === 0) this._populateSelectedRoms();
    return this._selectedRoms;
  }

  public addTitle(title: Title): void {
    this._allTitles.set(title.name, title);
  }

  public unselectTitles(criteria: (title: Title) => void) {
    for (const [_, title] of this._allTitles) criteria(title);
  }

  public update(): void {
    this._populateScrappedTitles();
    this._populateSelectedTitles();
    this._populateAllRoms();
    this._populateSelectedRoms();
  }

  private _populateScrappedTitles(): void {
    for (const [, title] of this._allTitles) {
      if (title.selectedRomsSize !== 0) continue;
      this._scrappedTitles.set(title.name, title);
    }
  }

  private _populateSelectedTitles(): void {
    for (const [, title] of this._allTitles) {
      if (title.selectedRomsSize < 1) continue;
      const titles = this._selectedTitles.get(title.selectedRomsSize);

      if (titles) titles.set(title.name, title);
      else
        this._selectedTitles.set(
          title.selectedRomsSize,
          new Map<string, Title>([[title.name, title]]),
        );
    }
  }

  private _populateAllRoms(): void {
    const titlesAllRoms = this._allTitles.values().map((t) => t.allRoms);
    for (const roms of titlesAllRoms)
      for (const [, rom] of roms.entries) this._allRoms.add(rom);
  }

  private _populateSelectedRoms(): void {
    const titlesSelectedRoms = this._allTitles
      .values()
      .map((t) => t.selectedRoms);
    for (const roms of titlesSelectedRoms)
      for (const [, rom] of roms.entries) this._selectedRoms.add(rom);
  }
}

export default Games;
