import type { RomFileType } from "../types/rom-file-type.type.js";

export interface Rom {
  filename: string;
  labels: string[];
  languages: string[];
  fileType: RomFileType;
}
