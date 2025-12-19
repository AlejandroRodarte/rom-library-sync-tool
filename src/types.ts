export interface Rom {
  filename: string;
  labels: string[];
  selected: boolean;
}

export type Groups = {
  [title: string]: Rom[];
};

export interface Console {
  name: string;
  info: {
    selected: {
      none: Groups;
      one: Groups;
      multiple: Groups;
    };
  };
}
