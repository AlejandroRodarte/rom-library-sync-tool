export interface LinesToAddAndDelete {
  add: Set<string>;
  delete: Set<string>;
}

const getLineSetsToAddAndDeleteFromOldAndNewLists = (
  oldList: string[],
  newList: string[],
): LinesToAddAndDelete => {
  const oldSet = new Set(oldList);
  const newSet = new Set(newList);

  const setToAdd = newSet.difference(oldSet);
  const setToDelete = oldSet.difference(newSet);

  return { add: setToAdd, delete: setToDelete };
};

export default getLineSetsToAddAndDeleteFromOldAndNewLists;
