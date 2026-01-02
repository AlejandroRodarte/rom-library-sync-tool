import type Title from "../../classes/title.class.js";

const byBannedLabels = (title: Title, labelPriorityList: string[]): void => {
  for (const bannedLabel of labelPriorityList) {
    if (!title.canUnselect()) return;

    const romIdsWithBannedLabel = title.selectedRomSet
      .entries()
      .filter(([id, rom]) => rom.labels.includes(bannedLabel))
      .map(([id]) => id)
      .toArray();

    const allRomsHaveBannedLabel =
      romIdsWithBannedLabel.length === title.selectedRomAmount;
    if (allRomsHaveBannedLabel) continue;

    title.unselectByIds(romIdsWithBannedLabel);
  }
};

export default byBannedLabels;
