import UNRELEASED_LABELS from "../constants/unreleased-labels.constant.js";
import UNWANTED_LABELS_BASE_LIST from "../constants/unwanted-labels-base-list.constant.js";
import VIRTUAL_CONSOLE_LABEL from "../constants/virtual-console-label.constant.js";
import type { Rom, SpecialFlags } from "../types.js";

const discardRomsBasedOnUnwantedLabelList = (
  roms: Rom[],
  countryLabel: string,
  specialFlags: SpecialFlags,
): void => {
  const unwantedLabels: string[] = [...UNWANTED_LABELS_BASE_LIST];
  if (!specialFlags.allRomsAreUnreleased)
    unwantedLabels.push(...UNRELEASED_LABELS);
  if (!specialFlags.allRomsAreForVirtualConsole)
    unwantedLabels.push(VIRTUAL_CONSOLE_LABEL);

  const selectedCountryRoms = roms.filter((rom) => {
    const isSelected = rom.selected;
    const hasCountryLabel = rom.labels.some((label) =>
      label.includes(countryLabel),
    );
    return isSelected && hasCountryLabel;
  });

  for (const rom of selectedCountryRoms) {
    for (const unwantedLabel of unwantedLabels) {
      const romHasUnwantedLabel = rom.labels.some((label) =>
        label.includes(unwantedLabel),
      );
      if (romHasUnwantedLabel) {
        rom.selected = false;
        break;
      }
    }
  }
};

export default discardRomsBasedOnUnwantedLabelList;
