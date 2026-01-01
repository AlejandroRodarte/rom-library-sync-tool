import type { Rom } from "../types.js";

const unselectByWhitelistedLabels = (
  roms: Rom[],
  labelPriorityList: string[],
  keepSelected = 1,
): void => {
  let selectedRoms = roms.filter((rom) => rom.selected);

  let selectedRomAmount = selectedRoms.length;
  if (selectedRomAmount === keepSelected) return;

  for (const wantedExactLabel of labelPriorityList) {
    const romsWithoutWantedLabel = selectedRoms.filter(
      (rom) => !rom.labels.includes(wantedExactLabel),
    );

    const romSetLacksWantedLabel =
      romsWithoutWantedLabel.length === selectedRoms.length;
    if (romSetLacksWantedLabel) continue;

    for (const romToUnselect of romsWithoutWantedLabel) {
      romToUnselect.selected = false;
      selectedRomAmount--;
      if (selectedRomAmount === keepSelected) return;
      selectedRoms = roms.filter((rom) => rom.selected);
    }
  }
};

export default unselectByWhitelistedLabels;
