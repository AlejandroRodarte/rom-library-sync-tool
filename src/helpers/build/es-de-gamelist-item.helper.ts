import path from "path";

import type { GamelistChildXmlNode } from "../../interfaces/gamelist-child-xml-node.interface.js";
import type { EsDeGamelistItem } from "../../types/es-de-gamelist-item.type.js";
import type { GamelistChildXmlNodeFields } from "../../types/gamelist-child-xml-node-fields.type.js";
import addFieldsToEsDeGamelistItemFromGamelistChildXmlNode from "../mutate/add-fields-to-es-de-gamelist-item-from-gamelist-child-xml-node.helper.js";

const esDeGamelistItem = (
  gamelistChildXmlNode: GamelistChildXmlNode,
  fields: GamelistChildXmlNodeFields[],
): [string, EsDeGamelistItem] | undefined => {
  const pathNode = gamelistChildXmlNode.path;
  if (!pathNode) return undefined;

  const [romFilePath] = pathNode;
  if (!romFilePath) return undefined;

  const romFilename = path.basename(romFilePath);
  const newEsDeGamelistItem = {
    path: romFilePath,
  };

  addFieldsToEsDeGamelistItemFromGamelistChildXmlNode(
    newEsDeGamelistItem,
    gamelistChildXmlNode,
    fields,
  );
  return [romFilename, newEsDeGamelistItem];
};

export default esDeGamelistItem;
