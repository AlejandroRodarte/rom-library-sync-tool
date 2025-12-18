export interface Rom {
  filename: string;
  labels: string[];
  selected: boolean;
}

export type Groups = {
  [title: string]: Rom[];
};
