import LANGUAGE_PRIORITY_LIST from "../../constants/language-priority-list.constant.js";

interface LabelsAndLanguages {
  labels: string[];
  languages: string[];
}

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
          const itemIsALanguage = LANGUAGE_PRIORITY_LIST.includes(trimmedItem);
          if (itemIsALanguage) languages.push(trimmedItem);
          else labels.push(trimmedItem);
        });
      }
    }
  }

  return { labels, languages };
};

export default labelsAndLanguagesFromFilename;
