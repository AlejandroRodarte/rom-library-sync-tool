import type { Rom } from "../../types.js";

const unselectByPALAndNTSCLabels = (roms: Rom[], keepSelected = 1): void => {
  const selectedRoms = roms.filter((rom) => rom.selected);

  let selectedRomAmount = selectedRoms.length;
  if (selectedRomAmount === keepSelected) return;

  const romSetHasNTSCLabel = selectedRoms.some((rom) =>
    rom.labels.some((label) => label.includes("NTSC")),
  );
  if (!romSetHasNTSCLabel) return;

  const palRoms = selectedRoms.filter((rom) =>
    rom.labels.some((label) => label.includes("PAL")),
  );

  for (const romToUnselect of palRoms) {
    romToUnselect.selected = false;
    selectedRomAmount--;
    if (selectedRomAmount === keepSelected) return;
  }
};

export default unselectByPALAndNTSCLabels;
