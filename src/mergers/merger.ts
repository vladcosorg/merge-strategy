export interface Merger {
  operate: (destination: unknown, source: unknown) => unknown
}
