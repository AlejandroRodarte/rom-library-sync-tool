import type Title from "./classes/title.class.js";

export interface Rom {
  filename: string;
  labels: string[];
  languages: string[];
  selected: boolean;
}

export type RomSet = Map<string, Rom>;

export type Titles = Map<string, Title>;
export type Console = Map<number, Titles>;

export type Consoles = Map<string, Console>;
export type DuplicatesData = Map<number, Titles>;

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

export interface RomIdAndVersion {
  id: string;
  version: string;
}

export interface LabelsAndLanguages {
  labels: string[];
  languages: string[];
}

export interface Environment {
  files: {
    replaceLists: boolean;
  };
  sftp: {
    connectToSteamDeck: boolean;
    credentials: {
      steamDeck: {
        host: string;
        port: number;
        username: string;
        password: string;
      };
    };
  };
}
