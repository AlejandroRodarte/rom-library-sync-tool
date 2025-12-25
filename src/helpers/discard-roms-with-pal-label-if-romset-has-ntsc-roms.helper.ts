import type { Rom } from "../types.js";

const discardRomsWithPALLabelIfRomsetHasNTSCRoms = (roms: Rom[]): void => {
  const selectedRoms = roms.filter((rom) => rom.selected);

  let romAmount = selectedRoms.length;
  if (romAmount === 1) return;

  const romSetHasNTSCLabel = selectedRoms.some((rom) =>
    rom.labels.some((label) => label.includes("NTSC")),
  );
  if (!romSetHasNTSCLabel) return;

  const palRoms = selectedRoms.filter((rom) =>
    rom.labels.some((label) => label.includes("PAL")),
  );

  for (const romToUnselect of palRoms) {
    romToUnselect.selected = false;
    romAmount--;
    if (romAmount === 1) return;
  }
};

export default discardRomsWithPALLabelIfRomsetHasNTSCRoms;
