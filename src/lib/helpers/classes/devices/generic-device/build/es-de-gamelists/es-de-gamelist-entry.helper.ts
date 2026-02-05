import path from "path";
import type { GamelistChildXmlNode } from "../../../../../../interfaces/classes/devices/generic-device/xml/gamelist-child-xml-node.interface.js";
import type { EsDeGamelistItem } from "../../../../../../types/es-de-gamelists/es-de-gamelist-item.type.js";
import type { GamelistChildXmlNodeFields } from "../../../../../../types/classes/devices/generic-device/xml/gamelist-child-xml-node-fields.type.js";
import populateEsDeGamelistItemFieldsFromGamelistChildXmlNode from "../../populate/populate-es-de-gamelist-item-fields-from-gamelist-child-xml-node.helper.js";

const esDeGamelistEntry = (
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

  populateEsDeGamelistItemFieldsFromGamelistChildXmlNode(
    newEsDeGamelistItem,
    gamelistChildXmlNode,
    fields,
  );
  return [romFilename, newEsDeGamelistItem];
};

export default esDeGamelistEntry;
