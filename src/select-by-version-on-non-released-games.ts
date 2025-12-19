import selectByVersion from "./select-by-version.js";
import type { Rom } from "./types.js";

const selectByVersionOnNonReleasedGames = (
  roms: Rom[],
  labels: string[],
): void => {
  let romsProcessed = false;

  for (const keywordLabel of labels) {
    if (romsProcessed) break;

    const allRomsHaveLabel = roms.every((rom) => {
      for (const label of rom.labels) {
        if (label.match(new RegExp("^" + keywordLabel + " [0-9]+$")))
          return true;
      }
      return false;
    });

    if (allRomsHaveLabel) {
      selectByVersion(
        roms,
        new RegExp("^" + keywordLabel + " [0-9]+$"),
        (label1, label2) => {
          const num1 = +label1.replace(new RegExp(keywordLabel + " "), "");
          const num2 = +label2.replace(new RegExp(keywordLabel + " "), "");
          if (num1 > num2) return 1;
          else if (num1 < num2) return -1;
          else return 0;
        },
      );

      romsProcessed = true;
    }
  }
};

export default selectByVersionOnNonReleasedGames;
