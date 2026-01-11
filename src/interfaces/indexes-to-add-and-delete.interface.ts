export interface IndexesToAddAndDelete {
  newFilenames: {
    toAdd: number[];
  };
  currentFilenames: {
    toDelete: number[];
  };
}
