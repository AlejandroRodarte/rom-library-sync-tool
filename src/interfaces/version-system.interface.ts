export interface VersionSystem {
  pattern: RegExp;
  compareFn: (label1: string, label2: string) => -1 | 0 | 1;
}
