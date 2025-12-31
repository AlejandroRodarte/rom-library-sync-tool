import type { Consoles } from "../types.js";

const printFinalConsolesReport = (consoles: Consoles): void => {
  const romsSelectedTotals = new Map<number, number>();

  for (const [name, konsole] of consoles) {
    console.log(`===== Report for console ${name} =====`);
    for (const [romsSelected, groups] of konsole) {
      console.log(`ROMs with ${romsSelected} selections: ${groups.size}`);
      const total = romsSelectedTotals.get(romsSelected);
      if (typeof total !== "undefined")
        romsSelectedTotals.set(romsSelected, total + groups.size);
      else romsSelectedTotals.set(romsSelected, groups.size);
    }
  }

  console.log(`===== Global Report =====`);
  for (const [romsSelected, total] of romsSelectedTotals)
    console.log(`ROMs with ${romsSelected} selections: ${total}`);
};

export default printFinalConsolesReport;
