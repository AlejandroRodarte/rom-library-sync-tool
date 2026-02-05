import ALL_ROM_LANGUAGES_SET from "../../../constants/roms/all-rom-languages-set.helper.js";
import type { RomLabelsAndLanguages } from "../../../interfaces/roms/rom-labels-and-languages.interface.js";

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
            ALL_ROM_LANGUAGES_SET.has(trimmedItem);
          if (itemIsALanguage) languages.push(trimmedItem);
          else labels.push(trimmedItem);
        });
      }
    }
  }

  return { labels, languages };
};

export default buildRomLabelsAndLanguagesFromRomFilename;
