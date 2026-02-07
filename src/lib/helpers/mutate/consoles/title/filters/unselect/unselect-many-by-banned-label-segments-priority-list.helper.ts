import type Title from "../../../../../../classes/entities/title.class.js";

const unselectManyByBannedLabelSegmentsPriorityList = (
  title: Title,
  labelSegmentsPriorityList: string[],
): void => {
  for (const bannedLabelSegment of labelSegmentsPriorityList) {
    if (!title.canUnselect()) break;

    const romIdsWithBannedLabelSegment = title.selectedRoms.entries
      .filter(([_, rom]) =>
        rom.labels.some((label) => label.includes(bannedLabelSegment)),
      )
      .map(([id]) => id)
      .toArray();

    title.unselectMany(romIdsWithBannedLabelSegment);
  }
};

export default unselectManyByBannedLabelSegmentsPriorityList;
