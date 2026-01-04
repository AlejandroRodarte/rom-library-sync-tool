import type { IndexesToAddAndDelete } from "../../types.js";

const filenameIndexesToAddAndDelete = (
  currentFilenames: string[],
  newFilenames: string[],
): IndexesToAddAndDelete => {
  const indexesToAdd: number[] = [];
  const indexesToOmit: number[] = [];

  for (const [index, newFilename] of newFilenames.entries()) {
    const indexWhereNewFilenameIsOnCurrentList = currentFilenames.findIndex(
      (f) => f === newFilename,
    );
    const newFilenameIsOnCurrentList =
      indexWhereNewFilenameIsOnCurrentList !== -1;

    if (newFilenameIsOnCurrentList) {
      indexesToOmit.push(indexWhereNewFilenameIsOnCurrentList);
      continue;
    }

    indexesToAdd.push(index);
  }

  const indexesToDelete = currentFilenames
    .map((_, i) => i)
    .filter((index) => !indexesToOmit.includes(index));

  return {
    newFilenames: {
      toAdd: indexesToAdd,
    },
    currentFilenames: {
      toDelete: indexesToDelete,
    },
  };
};

export default filenameIndexesToAddAndDelete;
