import type { EsDeGamelistAlternativeEmulator } from "../../../../../../types/es-de-gamelists/es-de-gamelist-alternative-emulator.type.js";

const buildEsDeGamelistAlternativeEmulators = (
  labels: string[],
): EsDeGamelistAlternativeEmulator[] => {
  const alternativeEmulators: EsDeGamelistAlternativeEmulator[] = [];
  for (const label of labels) {
    alternativeEmulators.push({ label });
  }
  return alternativeEmulators;
};

export default buildEsDeGamelistAlternativeEmulators;
