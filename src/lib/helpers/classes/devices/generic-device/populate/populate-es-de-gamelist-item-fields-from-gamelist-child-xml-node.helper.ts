import type { GamelistChildXmlNode } from "../../../../../interfaces/classes/devices/generic-device/xml/gamelist-child-xml-node.interface.js";
import type { GamelistChildXmlNodeFields } from "../../../../../types/classes/devices/generic-device/xml/gamelist-child-xml-node-fields.type.js";
import type { EsDeGamelistItem } from "../../../../../types/es-de-gamelists/es-de-gamelist-item.type.js";

const populateEsDeGamelistItemFieldsFromGamelistChildXmlNode = (
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

export default populateEsDeGamelistItemFieldsFromGamelistChildXmlNode;
