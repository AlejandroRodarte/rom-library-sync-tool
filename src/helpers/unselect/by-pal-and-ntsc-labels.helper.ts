import type Title from "../../classes/title.class.js";

const byPALAndNTSCLabels = (title: Title): void => {
  if (!title.canUnselect()) return;

  const romSetHasNTSCLabel = title.selectedRomSet
    .values()
    .some((rom) => rom.labels.some((label) => label.includes("NTSC")));
  if (!romSetHasNTSCLabel) return;

  const romIdsWithPALLabel = title.selectedRomSet
    .entries()
    .filter(([_, rom]) => rom.labels.some((label) => label.includes("PAL")))
    .map(([id]) => id)
    .toArray();

  title.unselectByIds(romIdsWithPALLabel);
};

export default byPALAndNTSCLabels;
