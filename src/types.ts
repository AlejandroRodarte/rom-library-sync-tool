export interface Rom {
  filename: string;
  labels: string[];
  selected: boolean;
}

export type Groups = {
  [title: string]: Rom[];
};

export interface Console {
  roms: {
    selected: {
      none: Groups;
      one: Groups;
      multiple: Groups;
    };
  };
}

export interface Consoles {
  [name: string]: Console;
}

export type DuplicatesData = {
  [amount: number]: Groups;
};
