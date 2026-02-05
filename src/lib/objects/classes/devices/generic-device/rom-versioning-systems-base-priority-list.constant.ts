import type { RomVersionSystem } from "../../../../interfaces/roms/rom-version-system.interface.js";
import a8fVersioning from "../../../rom-version-systems/a8f-versioning.object.js";
import dateVersioning from "../../../rom-version-systems/date-versioning.object.js";
import dshVersioning from "../../../rom-version-systems/ds-h-versioning.object.js";
import fightersVersioning from "../../../rom-version-systems/fighters-versioning.object.js";
import fjVersioning from "../../../rom-version-systems/fj-versioning.object.js";
import fsVersioning from "../../../rom-version-systems/fs-versioning.object.js";
import mbcVersioning from "../../../rom-version-systems/mbc-versioning.object.js";
import ninaVersioning from "../../../rom-version-systems/nina-versioning.object.js";
import numbersVersioning from "../../../rom-version-systems/numbers-versioning.object.js";
import peopleVersioning from "../../../rom-version-systems/people-versioning.object.js";
import rDotCDotVersioning from "../../../rom-version-systems/r-dot-c-dot-versioning.object.js";
import rNumberVersioning from "../../../rom-version-systems/r-number-versioning.object.js";
import revLetterVersioning from "../../../rom-version-systems/rev-letter-versioning.object.js";
import revNumberVersioning from "../../../rom-version-systems/rev-number-versioning.object.js";
import revUppercasedLetterVersioning from "../../../rom-version-systems/rev-uppercased-letter-versioning.object.js";
import tjVersioning from "../../../rom-version-systems/tj-versioning.object.js";
import vVersioning from "../../../rom-version-systems/v-versioning.object.js";

const ROM_VERSIONING_SYSTEMS_BASE_PRIORITY_LIST: RomVersionSystem[] = [
  vVersioning,
  revNumberVersioning,
  revUppercasedLetterVersioning,
  revLetterVersioning,
  rNumberVersioning,
  dateVersioning,
  fightersVersioning,
  peopleVersioning,
  fsVersioning,
  dshVersioning,
  tjVersioning,
  a8fVersioning,
  fjVersioning,
  mbcVersioning,
  ninaVersioning,
  rDotCDotVersioning,
  numbersVersioning,
];

export default ROM_VERSIONING_SYSTEMS_BASE_PRIORITY_LIST;
