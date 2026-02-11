import type { ConsolesGamesFilterFn } from "../../../../types/consoles/consoles-games-filter-fn.type.js";
import filterTitleUsingDefaultStrategy from "./filter-title-using-default-strategy.helper.js";

const filterConsolesGamesUsingDefaultStrategy: ConsolesGamesFilterFn = (
  consoles,
) => {
  for (const [, konsole] of consoles) {
    for (const [, title] of konsole.games.allTitles)
      filterTitleUsingDefaultStrategy(title);
    konsole.games.update();
  }
};

export default filterConsolesGamesUsingDefaultStrategy;
