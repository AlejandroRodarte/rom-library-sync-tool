export interface Rom {
  filename: string;
  labels: string[];
  selected: boolean;
}

export type Groups = Map<string, Rom[]>;

export interface Console {
  roms: {
    selected: {
      none: Groups;
      one: Groups;
      multiple: Groups;
    };
  };
}

export type Consoles = Map<string, Console>;
export type DuplicatesData = Map<number, Groups>;

export interface SpecialFlags {
  allRomsAreUnreleased: boolean;
  allRomsAreForVirtualConsole: boolean;
}

export interface VersionSystem {
  pattern: RegExp;
  compareFn: (label1: string, label2: string) => -1 | 0 | 1;
}

export interface RomIndexAndVersion {
  index: number;
  version: string;
}
