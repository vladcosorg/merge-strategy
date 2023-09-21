import { AbstractMerger } from '@/src/mergers/abstract-merger'
import { DefaultMerger } from '@/src/mergers/default-merger'

export class IndexMergerClass extends AbstractMerger {
  override operate(destination: unknown, source: unknown) {
    const output = Array.isArray(destination) ? [...source] : { ...source }
    for (const key of Array.isArray(destination)
      ? destination.keys()
      : Object.keys(destination)) {
      const value = destination[key]
      output[key] = this.rules[key]
        ? typeof this.rules[key] === 'function'
          ? this.rules[key](value, source[key])
          : this.rules[key].operate(value, source[key])
        : new DefaultMerger().operate(value, source[key])
    }

    return output
  }
}

export function indexMerger<T extends Record<string, unknown> | unknown[]>(
  destination: T,
  source: T,
  rules: any,
) {
  const output = Array.isArray(destination) ? [...source] : { ...source }
  for (const key of Array.isArray(destination)
    ? destination.keys()
    : Object.keys(destination)) {
    const value = destination[key]
    output[key] = rules[key]
      ? typeof rules[key] === 'function'
        ? rules[key](value, source[key])
        : rules[key].operate(value, source[key])
      : new DefaultMerger().operate(value, source[key])
  }

  return output
}
