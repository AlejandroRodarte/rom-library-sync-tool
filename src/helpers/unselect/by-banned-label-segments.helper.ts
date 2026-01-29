import type Title from "../../classes/title.class.js";

const byBannedLabelSegments = (title: Title, labelSegments: string[]): void => {
  for (const bannedLabelSegment of labelSegments) {
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

export default byBannedLabelSegments;
