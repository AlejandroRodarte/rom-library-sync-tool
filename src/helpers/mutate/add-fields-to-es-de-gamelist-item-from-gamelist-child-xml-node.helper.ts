import type { GamelistChildXmlNode } from "../../interfaces/gamelist-child-xml-node.interface.js";
import type { EsDeGamelistItem } from "../../types/es-de-gamelist-item.type.js";
import type { GamelistChildXmlNodeFields } from "../../types/gamelist-child-xml-node-fields.type.js";

const addFieldsToEsDeGamelistItemFromGamelistChildXmlNode = (
  esDeGamelistItem: EsDeGamelistItem,
  gamelistChildXmlNode: GamelistChildXmlNode,
  fields: GamelistChildXmlNodeFields[],
): void => {
  const uniqueFields = [...new Set(fields)];

  for (const field of uniqueFields) {
    const fieldNode = gamelistChildXmlNode[field];
    if (fieldNode && fieldNode[0]) esDeGamelistItem[field] = fieldNode[0];
  }
};

export default addFieldsToEsDeGamelistItemFromGamelistChildXmlNode;
