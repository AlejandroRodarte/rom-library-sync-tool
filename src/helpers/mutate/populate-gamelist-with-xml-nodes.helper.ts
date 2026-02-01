import type Gamelist from "../../classes/gamelist.class.js";
import type { GamelistChildXmlNode } from "../../interfaces/gamelist-child-xml-node.interface.js";
import type { GamelistChildXmlNodeFields } from "../../types/gamelist-child-xml-node-fields.type.js";
import esDeGamelistEntriesFromGamelistChildXmlNodes from "../build/es-de-gamelist-entries-from-gamelist-child-xml-nodes.helper.js";

const build = {
  esDeGamelistEntriesFromGamelistChildXmlNodes,
};

const populateGamelistWithXmlNodes = (
  gamelist: Gamelist,
  types: {
    game: {
      xmlNodes: GamelistChildXmlNode[];
      fields: GamelistChildXmlNodeFields[];
    };
    folder: {
      xmlNodes: GamelistChildXmlNode[];
      fields: GamelistChildXmlNodeFields[];
    };
  },
): void => {
  gamelist.addGames(
    build.esDeGamelistEntriesFromGamelistChildXmlNodes(
      types.game.xmlNodes,
      types.game.fields,
    ),
  );

  gamelist.addFolders(
    build.esDeGamelistEntriesFromGamelistChildXmlNodes(
      types.folder.xmlNodes,
      types.folder.fields,
    ),
  );
};

export default populateGamelistWithXmlNodes;
