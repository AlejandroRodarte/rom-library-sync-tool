import type { AlternativeEmulatorXmlNode } from "../../interfaces/classes/devices/generic-device/xml/alternative-emulator-xml-node.interface.js";

export type EsDeGamelistAlternativeEmulator = {
  [K in keyof AlternativeEmulatorXmlNode]: string;
};
