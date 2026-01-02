import type Title from "../../classes/title.class.js";

const byWhitelistedLabels = (
  title: Title,
  labelPriorityList: string[],
): void => {
  if (!title.canUnselect()) return;

  for (const wantedExactLabel of labelPriorityList) {
    const romIdsWithoutWhitelistedLabel = title.selectedRomSet
      .entries()
      .filter(([, rom]) => !rom.labels.includes(wantedExactLabel))
      .map(([id]) => id)
      .toArray();

    const romSetLacksWhitelistedLabel =
      romIdsWithoutWhitelistedLabel.length === title.selectedRomAmount;
    if (romSetLacksWhitelistedLabel) continue;

    title.unselectByIds(romIdsWithoutWhitelistedLabel);
  }
};

export default byWhitelistedLabels;
