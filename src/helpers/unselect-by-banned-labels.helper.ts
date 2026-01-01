import type { Rom } from "../types.js";

const unselectByBannedLabels = (
  roms: Rom[],
  labelPriorityList: string[],
  keepSelected = 1,
): void => {
  let selectedRoms = roms.filter((rom) => rom.selected);

  let selectedRomAmount = selectedRoms.length;
  if (selectedRomAmount === keepSelected) return;

  for (const bannedLabel of labelPriorityList) {
    const romsWithUnwantedLabel = selectedRoms.filter((rom) =>
      rom.labels.includes(bannedLabel),
    );

    const allRomsHaveUnwantedLabel =
      romsWithUnwantedLabel.length === selectedRoms.length;
    if (allRomsHaveUnwantedLabel) continue;

    for (const romToDeselect of romsWithUnwantedLabel) {
      romToDeselect.selected = false;
      selectedRomAmount--;
      if (selectedRomAmount === keepSelected) return;
      selectedRoms = roms.filter((rom) => rom.selected);
    }
  }
};

export default unselectByBannedLabels;
