import type { GamelistChildXmlNode } from "../../interfaces/gamelist-child-xml-node.interface.js";
import type { EsDeGamelistItem } from "../../types/es-de-gamelist-item.type.js";
import type { GamelistChildXmlNodeFields } from "../../types/gamelist-child-xml-node-fields.type.js";
import esDeGamelistItem from "./es-de-gamelist-item.helper.js";

const esDeGamelistEntriesFromGamelistChildXmlNodes = (
  gamelistChildXmlNodes: GamelistChildXmlNode[],
  fields: GamelistChildXmlNodeFields[],
): [string, EsDeGamelistItem][] =>
  gamelistChildXmlNodes
    .map<[string, EsDeGamelistItem] | undefined>((gamelistChildXmlNode) => {
      const buildResult = esDeGamelistItem(gamelistChildXmlNode, fields);
      if (!buildResult) return undefined;
      const [filename, newEsDeGamelistItem] = buildResult;
      return [filename, newEsDeGamelistItem];
    })
    .filter((i) => typeof i !== "undefined");

export default esDeGamelistEntriesFromGamelistChildXmlNodes;
