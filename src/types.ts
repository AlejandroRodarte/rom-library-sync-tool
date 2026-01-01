export interface Rom {
  filename: string;
  labels: string[];
  languages: string[];
  selected: boolean;
}

export type Groups = Map<string, Rom[]>;
export type Console = Map<number, Groups>;

export type Consoles = Map<string, Console>;
export type DuplicatesData = Map<number, Groups>;

export interface SpecialFlags {
  allRomsAreUnreleased: boolean;
  allRomsAreBeta: boolean;
  allRomsAreProto: boolean;
  allRomsAreDemo: boolean;
  allRomsAreSample: boolean;
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

export interface LabelsAndLanguages {
  labels: string[];
  languages: string[];
}
