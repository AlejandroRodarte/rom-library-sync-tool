import AppExistsError from "./errors/app-exists-error.class.js";
import Title from "./title.class.js";
import type { ConsoleName } from "../types/console-name.type.js";
import type { Titles } from "../types/titles.type.js";
import type { RomSet } from "../types/rom-set.type.js";
import type { Rom } from "../interfaces/rom.interface.js";

export type AddTitleMethodError = AppExistsError;

class Console {
  private _name: ConsoleName;
  private _titles: Titles;

  private _scrappedTitles: Titles;
  private _selectedTitles: Map<number, Titles>;
  private _selectedRoms: RomSet;

  constructor(name: ConsoleName) {
    this._name = name;
    this._titles = new Map<string, Title>();

    this._selectedTitles = new Map<number, Titles>();
    this._scrappedTitles = new Map<string, Title>();
    this._selectedRoms = new Map<string, Rom>();
  }

  get name() {
    return this._name;
  }

  get selectedTitles() {
    return this._selectedTitles;
  }

  get scrappedTitles() {
    return this._scrappedTitles;
  }

  get duplicateTitles(): Map<number, Titles> {
    const duplicates = new Map(this._selectedTitles);
    duplicates.delete(1);
    return duplicates;
  }

  get selectedRoms() {
    return this._selectedRoms;
  }

  get report(): string {
    let content = `***** Report for console ${this._name} *****\n`;
    content += `Titles with 0 selections: ${this.scrappedTitles.size}.\n`;

    for (const [romsSelected, titles] of this.selectedTitles)
      content += `Titles with ${romsSelected} selections: ${titles.size}.\n`;

    return content;
  }

  public addTitle(
    titleName: string,
    title: Title,
  ): AddTitleMethodError | undefined {
    const titleExists = this._titles.has(titleName);

    if (titleExists)
      return new AppExistsError(
        `Entry for title ${titleName} already exists.`,
      );

    this._titles.set(titleName, title);
  }

  public unselectTitles(criteria: (title: Title) => void) {
    for (const [_, title] of this._titles) criteria(title);
  }

  public updateSelectedTitles(): void {
    const duplicates = new Map<number, Titles>();

    for (const [titleName, title] of this._titles) {
      if (title.selectedRomAmount < 1) continue;

      const duplicateTitles = duplicates.get(title.selectedRomAmount);
      if (duplicateTitles) duplicateTitles.set(titleName, title);
      else
        duplicates.set(
          title.selectedRomAmount,
          new Map<string, Title>([[titleName, title]]),
        );
    }

    this._selectedTitles = duplicates;
  }

  public updateScrappedTitles(): void {
    const scrapped = new Map<string, Title>();

    for (const [titleName, title] of this._titles) {
      if (title.selectedRomAmount !== 0) continue;
      scrapped.set(titleName, title);
    }

    this._scrappedTitles = scrapped;
  }

  public updateSelectedRoms(): void {
    const romSet: RomSet = new Map<string, Rom>();

    for (const [_, title] of this._titles) {
      title.selectedRomSet
        .entries()
        .forEach(([id, rom]) => romSet.set(id, rom));
    }

    this._selectedRoms = romSet;
  }
}

export default Console;
