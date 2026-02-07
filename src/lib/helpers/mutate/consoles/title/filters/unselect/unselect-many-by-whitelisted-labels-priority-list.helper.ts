import type Title from "../../../../../../classes/entities/title.class.js";

const unselectManyByWhitelistedLabelsPriorityList = (
  title: Title,
  labelPriorityList: string[],
): void => {
  if (!title.canUnselect()) return;

  for (const wantedExactLabel of labelPriorityList) {
    const romIdsWithoutWhitelistedLabel = title.selectedRoms.entries
      .filter(([, rom]) => !rom.labels.includes(wantedExactLabel))
      .map(([id]) => id)
      .toArray();

    const romSetLacksWhitelistedLabel =
      romIdsWithoutWhitelistedLabel.length === title.selectedRomsSize;
    if (romSetLacksWhitelistedLabel) continue;

    title.unselectMany(romIdsWithoutWhitelistedLabel);
  }
};

export default unselectManyByWhitelistedLabelsPriorityList;
