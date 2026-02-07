import filterConsolesGamesUsingDefaultStrategy from "../../helpers/mutate/consoles/filters/filter-consoles-games-using-default-strategy.helper.js";
import type { ConsolesGamesFilterFn } from "../../types/consoles/consoles-games-filter-fn.type.js";

const consolesGamesFilterFunctions: {
  [deviceName: string]: ConsolesGamesFilterFn;
} = {
  "alejandro-g751jt": filterConsolesGamesUsingDefaultStrategy,
  "steam-deck-lcd-alejandro": filterConsolesGamesUsingDefaultStrategy,
  default: filterConsolesGamesUsingDefaultStrategy,
};

export default consolesGamesFilterFunctions;
