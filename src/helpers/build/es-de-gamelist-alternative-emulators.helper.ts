import type { EsDeGamelistAlternativeEmulator } from "../../types/es-de-gamelist-alternative-emulator.type.js";

const esDeGamelistAlternativeEmulators = (
  labels: string[],
): EsDeGamelistAlternativeEmulator[] => {
  const alternativeEmulators: EsDeGamelistAlternativeEmulator[] = [];
  for (const label of labels) {
    alternativeEmulators.push({ label });
  }
  return alternativeEmulators;
};

export default esDeGamelistAlternativeEmulators;
