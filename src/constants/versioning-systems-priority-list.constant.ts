import a8fVersioning from "../objects/version-systems/a8f-versioning.object.js";
import dateVersioning from "../objects/version-systems/date-versioning.object.js";
import dshVersioning from "../objects/version-systems/ds-h-versioning.object.js";
import fightersVersioning from "../objects/version-systems/fighters-versioning.object.js";
import fsVersioning from "../objects/version-systems/fs-versioning.object.js";
import numbersVersioning from "../objects/version-systems/numbers-versioning.object.js";
import peopleVersioning from "../objects/version-systems/people-versioning.object.js";
import rNumberVersioning from "../objects/version-systems/r-number-versioning.object.js";
import revLetterVersioning from "../objects/version-systems/rev-letter-versioning.object.js";
import revNumberVersioning from "../objects/version-systems/rev-number-versioning.object.js";
import revUppercasedLetterVersioning from "../objects/version-systems/rev-uppercased-letter-versioning.object.js";
import tjVersioning from "../objects/version-systems/tj-versioning.object.js";
import vVersioning from "../objects/version-systems/v-versioning.object.js";
import type { VersionSystem } from "../types.js";
import fjVersioning from "../objects/version-systems/fj-versioning.object.js";
import mbcVersioning from "../objects/version-systems/mbc-versioning.object.js";
import ninaVersioning from "../objects/version-systems/nina-versioning.object.js";
import rDotCDotVersioning from "../objects/version-systems/r-dot-c-dot-versioning.object.js";

const VERSIONING_SYSTEMS_PRIORITY_LIST: VersionSystem[] = [
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

export default VERSIONING_SYSTEMS_PRIORITY_LIST;
