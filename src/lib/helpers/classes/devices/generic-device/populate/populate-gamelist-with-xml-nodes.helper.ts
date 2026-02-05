import type Gamelist from "../../../../../classes/entities/gamelist.class.js";
import type { GamelistChildXmlNode } from "../../../../../interfaces/classes/devices/generic-device/xml/gamelist-child-xml-node.interface.js";
import type { GamelistChildXmlNodeFields } from "../../../../../types/classes/devices/generic-device/xml/gamelist-child-xml-node-fields.type.js";
import esDeGamelistEntriesFromGamelistChildXmlNodes from "../build/es-de-gamelists/es-de-gamelist-entries-from-gamelist-child-xml-nodes.helper.js";

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
    esDeGamelistEntriesFromGamelistChildXmlNodes(
      types.game.xmlNodes,
      types.game.fields,
    ),
  );

  gamelist.addFolders(
    esDeGamelistEntriesFromGamelistChildXmlNodes(
      types.folder.xmlNodes,
      types.folder.fields,
    ),
  );
};

export default populateGamelistWithXmlNodes;
