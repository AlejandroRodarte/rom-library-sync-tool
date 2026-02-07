import type { RomLabelsAndLanguages } from "../../../interfaces/roms/rom-labels-and-languages.interface.js";
import type { RomLanguage } from "../../../types/roms/rom-language.type.js";
import typeGuards from "../../typescript/guards/index.js";

const buildRomLabelsAndLanguagesFromRomFilename = (
  filename: string,
): RomLabelsAndLanguages => {
  const labels: string[] = [];
  const languages: RomLanguage[] = [];

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
          const itemIsALanguage = typeGuards.isRomLanguage(trimmedItem);
          if (itemIsALanguage) languages.push(trimmedItem);
          else labels.push(trimmedItem);
        });
      }
    }
  }

  return { labels, languages };
};

export default buildRomLabelsAndLanguagesFromRomFilename;
