import type { AlternativeEmulatorXmlNode } from "./alternative-emulator-xml-node.interface.js";
import type { GamelistXmlNode } from "./gamelist-xml-node.interface.js";

export interface EsDeGamelistRootXmlNode {
  root: {
    alternativeEmulator?: AlternativeEmulatorXmlNode[];
    gameList?: GamelistXmlNode[];
  };
}
