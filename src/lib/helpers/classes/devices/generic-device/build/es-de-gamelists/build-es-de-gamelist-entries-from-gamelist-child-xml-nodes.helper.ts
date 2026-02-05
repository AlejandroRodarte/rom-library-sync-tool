import type { GamelistChildXmlNode } from "../../../../../../interfaces/classes/devices/generic-device/xml/gamelist-child-xml-node.interface.js";
import type { GamelistChildXmlNodeFields } from "../../../../../../types/classes/devices/generic-device/xml/gamelist-child-xml-node-fields.type.js";
import type { EsDeGamelistItem } from "../../../../../../types/es-de-gamelists/es-de-gamelist-item.type.js";
import buildEsDeGamelistEntryFromGamelistChildXmlNode from "./build-es-de-gamelist-entry-from-gamelist-child-xml-node.helper.js";

const buildEsDeGamelistEntriesFromGamelistChildXmlNodes = (
  gamelistChildXmlNodes: GamelistChildXmlNode[],
  fields: GamelistChildXmlNodeFields[],
): [string, EsDeGamelistItem][] =>
  gamelistChildXmlNodes
    .map<[string, EsDeGamelistItem] | undefined>((gamelistChildXmlNode) => {
      const buildResult = buildEsDeGamelistEntryFromGamelistChildXmlNode(
        gamelistChildXmlNode,
        fields,
      );
      if (!buildResult) return undefined;
      return buildResult;
    })
    .filter((i) => typeof i !== "undefined");

export default buildEsDeGamelistEntriesFromGamelistChildXmlNodes;
