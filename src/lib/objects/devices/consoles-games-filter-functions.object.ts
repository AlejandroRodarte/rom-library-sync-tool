import {
  NINTENDO_GAMECUBE,
  NINTENDO_WII,
  PLAYSTATION_PORTABLE,
} from "../../constants/consoles/console-names.constants.js";
import filterConsolesGamesUsingDefaultStrategy from "../../helpers/mutate/consoles/filters/filter-consoles-games-using-default-strategy.helper.js";
import filterTitleUsingDefaultStrategy from "../../helpers/mutate/consoles/filters/filter-title-using-default-strategy.helper.js";
import banTitlesByName from "../../helpers/mutate/consoles/titles/filters/ban/ban-titles-by-name.helper.js";
import type { ConsolesGamesFilterFn } from "../../types/consoles/consoles-games-filter-fn.type.js";

const consolesGamesFilterFunctions: {
  [deviceName: string]: ConsolesGamesFilterFn;
} = {
  "alejandro-g751jt": filterConsolesGamesUsingDefaultStrategy,
  "steam-deck-lcd-alejandro": (consoles) => {
    for (const [, konsole] of consoles) {
      for (const [, title] of konsole.games.allTitles)
        filterTitleUsingDefaultStrategy(title);

      switch (konsole.name) {
        case NINTENDO_GAMECUBE:
          banTitlesByName(konsole.games.allTitles, [
            "Mario Party 4",
            "Mario Party 5",
            "Mario Party 6",
            "Mario Party 7",
          ]);
          break;
        case NINTENDO_WII:
          banTitlesByName(konsole.games.allTitles, [
            "Mario Kart Wii",
            "Mario Strikers Charged Football",
            "Metal Slug Anthology",
          ]);
          break;
        case PLAYSTATION_PORTABLE:
          banTitlesByName(konsole.games.allTitles, [
            "2010 FIFA World Cup : South Africa",
            "Densha De Go! Pocket Yamanotesen Hen",
            "Dragon Ball Z : Shin Budokai 2",
            "FIFA 10",
            "Gran Turismo",
            "Ridge Racer",
          ]);
          break;
        default:
          break;
      }

      konsole.games.update();
    }
  },
  default: filterConsolesGamesUsingDefaultStrategy,
};

export default consolesGamesFilterFunctions;
