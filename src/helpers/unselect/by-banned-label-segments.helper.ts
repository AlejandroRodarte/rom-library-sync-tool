import type { Rom } from "../../types.js";

const unselectByBannedLabelSegments = (
  roms: Rom[],
  labelSegments: string[],
  keepSelected = 1,
): void => {
  let selectedRoms = roms.filter((rom) => rom.selected);

  let selectedRomAmount = selectedRoms.length;
  if (selectedRomAmount === keepSelected) return;

  for (const bannedLabelSegment of labelSegments) {
    const romsWithBannedLabelSegment = selectedRoms.filter((rom) =>
      rom.labels.some((label) => label.includes(bannedLabelSegment)),
    );

    for (const romToUnselect of romsWithBannedLabelSegment) {
      romToUnselect.selected = false;
      selectedRomAmount--;
      if (selectedRomAmount === keepSelected) return;
      selectedRoms = roms.filter((rom) => rom.selected);
    }
  }
};

export default unselectByBannedLabelSegments;
