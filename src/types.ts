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
