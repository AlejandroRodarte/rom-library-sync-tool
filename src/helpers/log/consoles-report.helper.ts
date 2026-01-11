import logger from "../../objects/logger.object.js";
import type { Consoles } from "../../types/consoles.type.js";

const consolesReport = (consoles: Consoles): void => {
  for (const [_, konsole] of consoles) logger.info(konsole.report);

  const romsSelectedTotals = new Map<number, number>();

  for (const [_, konsole] of consoles) {
    romsSelectedTotals.set(0, konsole.scrappedTitles.size);
    for (const [romsSelected, titles] of konsole.selectedTitles) {
      const total = romsSelectedTotals.get(romsSelected);
      if (typeof total !== "undefined")
        romsSelectedTotals.set(romsSelected, total + titles.size);
      else romsSelectedTotals.set(romsSelected, titles.size);
    }
  }

  logger.info(`***** All-Consoles Report *****`);
  for (const [romsSelected, total] of romsSelectedTotals)
    logger.info(`Titles with ${romsSelected} selections: ${total}.`);
};

export default consolesReport;
