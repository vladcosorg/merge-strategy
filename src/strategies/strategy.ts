export interface Strategy {
  operate: (destination: unknown, source: unknown) => unknown
}
