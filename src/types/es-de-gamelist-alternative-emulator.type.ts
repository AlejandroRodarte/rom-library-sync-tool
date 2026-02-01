import type { AlternativeEmulatorXmlNode } from "../interfaces/alternative-emulator-xml-node.interface.js";

export type EsDeGamelistAlternativeEmulator = {
  [K in keyof AlternativeEmulatorXmlNode]: string;
};
