import UNRELEASED_LABELS from "../constants/unreleased-labels.constant.js";
import UNWANTED_EXACT_LABELS_BASE_LIST from "../constants/unwanted-exact-labels-base-list.constant.js";
import VIRTUAL_CONSOLE_LABEL from "../constants/virtual-console-label.constant.js";
import type { Rom, SpecialFlags } from "../types.js";

interface UnwantedLabels {
  exact: string[];
  includes: string[];
}

const discardRomsBasedOnUnwantedLabelList = (
  roms: Rom[],
  countryLabel: string,
  specialFlags: SpecialFlags,
): void => {
  const unwantedLabels: UnwantedLabels = {
    exact: UNWANTED_EXACT_LABELS_BASE_LIST,
    includes: [],
  };

  if (!specialFlags.allRomsAreUnreleased)
    unwantedLabels.includes.push(...UNRELEASED_LABELS);
  if (!specialFlags.allRomsAreForVirtualConsole)
    unwantedLabels.includes.push(VIRTUAL_CONSOLE_LABEL);

  const selectedCountryRoms = roms.filter((rom) => {
    const isSelected = rom.selected;
    const hasCountryLabel = rom.labels.includes(countryLabel);
    return isSelected && hasCountryLabel;
  });

  for (const rom of selectedCountryRoms) {
    let romHasUnwantedLabel = false;

    for (const unwantedIncludesLabel of unwantedLabels.includes) {
      romHasUnwantedLabel = rom.labels.some((label) =>
        label.includes(unwantedIncludesLabel),
      );
      if (romHasUnwantedLabel) break;
    }

    if (romHasUnwantedLabel) {
      rom.selected = false;
      continue;
    }

    for (const unwantedExactLabel of unwantedLabels.exact) {
      romHasUnwantedLabel = rom.labels.includes(unwantedExactLabel);
      if (romHasUnwantedLabel) break;
    }

    if (romHasUnwantedLabel) rom.selected = false;
  }
};

export default discardRomsBasedOnUnwantedLabelList;
