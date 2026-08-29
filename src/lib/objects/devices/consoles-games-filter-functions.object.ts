import {
  NINTENDO_GAMECUBE,
  NINTENDO_WII,
  PLAYSTATION_PORTABLE,
} from "../../constants/consoles/console-names.constants.js";
import filterConsolesGamesUsingDefaultStrategy from "../../helpers/mutate/consoles/filters/filter-consoles-games-using-default-strategy.helper.js";
import filterTitleUsingDefaultStrategy from "../../helpers/mutate/consoles/filters/filter-title-using-default-strategy.helper.js";
import mutateTitlesByName from "../../helpers/mutate/consoles/titles/mutate-titles-by-name.helper.js";
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
          mutateTitlesByName(
            konsole.games.allTitles,
            new Map([
              ["Mario Party 4", (title) => title.ban()],
              ["Mario Party 5", (title) => title.ban()],
              ["Mario Party 6", (title) => title.ban()],
              ["Mario Party 7", (title) => title.ban()],
              [
                "Luigi's Mansion",
                (title) => {
                  title.unselectOne("Luigi's Mansion (USA, Canada).rvz", {
                    force: true,
                  });
                  title.selectOne(
                    "Luigi's Mansion (Europe) (En,Fr,De,Es,It) (Rev 1).rvz",
                    { force: true },
                  );
                },
              ],
            ]),
          );
          break;
        case NINTENDO_WII:
          mutateTitlesByName(
            konsole.games.allTitles,
            new Map([
              ["Mario Kart Wii", (title) => title.ban()],
              ["Mario Strikers Charged Football", (title) => title.ban()],
              ["Metal Slug Anthology", (title) => title.ban()],
            ]),
          );
          break;
        case PLAYSTATION_PORTABLE:
          mutateTitlesByName(
            konsole.games.allTitles,
            new Map([
              ["2010 FIFA World Cup : South Africa", (title) => title.ban()],
              ["Densha De Go! Pocket Yamanotesen Hen", (title) => title.ban()],
              ["Dragon Ball Z : Shin Budokai 2", (title) => title.ban()],
              ["FIFA 10", (title) => title.ban()],
              ["Gran Turismo", (title) => title.ban()],
              ["Ridge Racer", (title) => title.ban()],
            ]),
          );
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
