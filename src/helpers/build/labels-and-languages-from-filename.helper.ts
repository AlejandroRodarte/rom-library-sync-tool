import LANGUAGE_BASE_PRIORITY_LIST from "../../constants/language-base-priority-list.constant.js";
import type { LabelsAndLanguages } from "../../interfaces/labels-and-languages.interface.js";

const labelsAndLanguagesFromFilename = (
  filename: string,
): LabelsAndLanguages => {
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

export default labelsAndLanguagesFromFilename;
