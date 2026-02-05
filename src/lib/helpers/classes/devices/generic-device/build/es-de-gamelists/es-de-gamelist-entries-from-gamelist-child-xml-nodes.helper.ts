import type { GamelistChildXmlNode } from "../../../../../../interfaces/classes/devices/generic-device/xml/gamelist-child-xml-node.interface.js";
import type { GamelistChildXmlNodeFields } from "../../../../../../types/classes/devices/generic-device/xml/gamelist-child-xml-node-fields.type.js";
import type { EsDeGamelistItem } from "../../../../../../types/es-de-gamelists/es-de-gamelist-item.type.js";
import esDeGamelistEntry from "./es-de-gamelist-entry.helper.js";

const esDeGamelistEntriesFromGamelistChildXmlNodes = (
  gamelistChildXmlNodes: GamelistChildXmlNode[],
  fields: GamelistChildXmlNodeFields[],
): [string, EsDeGamelistItem][] =>
  gamelistChildXmlNodes
    .map<[string, EsDeGamelistItem] | undefined>((gamelistChildXmlNode) => {
      const buildResult = esDeGamelistEntry(gamelistChildXmlNode, fields);
      if (!buildResult) return undefined;
      return buildResult;
    })
    .filter((i) => typeof i !== "undefined");

export default esDeGamelistEntriesFromGamelistChildXmlNodes;
