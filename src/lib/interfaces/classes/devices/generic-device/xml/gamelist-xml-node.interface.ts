import type { GamelistChildXmlNode } from "./gamelist-child-xml-node.interface.js";

export interface GamelistXmlNode {
  game?: GamelistChildXmlNode[];
  folder?: GamelistChildXmlNode[];
}
