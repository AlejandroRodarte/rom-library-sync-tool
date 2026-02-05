import type { RomLabelsAndLanguages } from "../../../interfaces/roms/rom-labels-and-languages.interface.js";
import LANGUAGE_BASE_PRIORITY_LIST from "../../../objects/classes/devices/generic-device/language-base-priority-list.constant.js";

const buildRomLabelsAndLanguagesFromRomFilename = (
  filename: string,
): RomLabelsAndLanguages => {
  const labels: string[] = [];
  const languages: string[] = [];

  const labelsRegexp = /\((.*?)\)/g;
  const matches = filename.matchAll(labelsRegexp);

  for (const match of matches) {
    const [, parenthesesText] = match;
    if (parenthesesText) {
      const parenthesesGroups = parenthesesText.split(",");
      for (const parenthesesGroup of parenthesesGroups) {
        const parenthesesItems = parenthesesGroup.split("+");
        parenthesesItems.forEach((item) => {
          const trimmedItem = item.trim();
          const itemIsALanguage =
            LANGUAGE_BASE_PRIORITY_LIST.includes(trimmedItem);
          if (itemIsALanguage) languages.push(trimmedItem);
          else labels.push(trimmedItem);
        });
      }
    }
  }

  return { labels, languages };
};

export default buildRomLabelsAndLanguagesFromRomFilename;
