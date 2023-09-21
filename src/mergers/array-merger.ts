import { isEqual } from 'lodash'

import { AbstractMerger } from '@/src/mergers/abstract-merger'
import { IndexMergerClass } from '@/src/mergers/index-merger'

function ensureArray<T>(input: T | T[]): T[] {
  return Array.isArray(input) ? input : [input]
}

function replaceDuplicates<T extends Array<Record<string, unknown>>>(
  destination: T,
  source: T,
) {
  const simplify = (input: any): any => JSON.parse(JSON.stringify(input))
  const simpDestination = destination.map((item) => simplify(item))
  const simpSource = source.map((item) => simplify(item))

  const output = [...source]

  const newValues = []
  for (const destinationKey of simpDestination.keys()) {
    let isEqualStatus = false
    for (const sourceKey of simpSource.keys()) {
      if (!isEqual(simpDestination[destinationKey], simpSource[sourceKey])) {
        continue
      }

      output[sourceKey] = destination[destinationKey]
      isEqualStatus = true
    }

    if (isEqualStatus === false) {
      newValues.push(destination[destinationKey])
    }
  }

  return {
    source: output,
    destination: newValues,
  }
}

function insertAt<T extends unknown[], N extends unknown[]>(
  source: T,
  index: number,
  destination: N,
  {
    allowDuplicates = true,
  }: {
    allowDuplicates?: boolean
  } = {},
) {
  if (!allowDuplicates) {
    const deduped = replaceDuplicates(destination, source)
    source = deduped.source
    destination = deduped.destination
  }

  return [
    // part of the array before the specified index
    ...source.slice(0, index),
    // inserted items
    ...destination,
    // part of the array after the specified index
    ...source.slice(index),
  ]
}

function defaultSearchFunction(
  input: unknown[],
  predicate: (row: unknown) => boolean,
): number {
  for (const [key, value] of input.entries()) {
    const result = predicate(value)
    if (!result) {
      continue
    }

    return key
  }

  return -1
}

export class ArrayMerger extends AbstractMerger {
  protected allowDuplicates: boolean = true
  protected insertMethod: 'after' | 'before' = 'after'
  protected insertIndex?:
    | number
    | ((currentRow: unknown, currentIndex: number) => number)
  protected searchFunction?: (input, predicate) => number
  protected ifNotFound: 'error' | 'insert' | 'skip' = 'insert'
  protected wrapUnwrap: boolean = false

  constructor(config = {}) {
    super()
    Object.assign(this, config)
  }

  public insertAtIndex(index: number) {
    this.insertIndex = index
    return this
  }

  public insertAtIndexWith(
    function_: (currentRow: unknown, currentIndex: number) => number,
  ) {
    this.insertIndex = function_
    return this
  }

  public insertAfter() {
    this.insertMethod = 'after'
    return this
  }

  public insertBefore() {
    this.insertMethod = 'before'
    return this
  }

  public permitDuplicates() {
    this.allowDuplicates = true
    return this
  }

  public overwriteDuplicates() {
    this.allowDuplicates = false
    return this
  }

  override operate<T extends unknown[] | unknown>(
    maybeDestination: T,
    maybeSource: T,
  ) {
    const destination = ensureArray(maybeDestination)
    const source = ensureArray(maybeSource)
    let index
    if (this.insertIndex === undefined) {
      index = this.insertMethod === 'after' ? destination.length + 1 : 0
    } else if (
      typeof this.insertIndex === 'function' ||
      typeof this.searchFunction === 'function'
    ) {
      this.searchFunction ??= defaultSearchFunction

      index = this.searchFunction(source, this.insertIndex)

      if (index < 0) {
        switch (this.ifNotFound) {
          case 'insert': {
            index = this.insertMethod === 'after' ? destination.length : 0
            break
          }
          case 'skip': {
            return source
          }

          default: {
            throw new Error('index returned empty')
          }
        }
      }

      index = this.insertMethod === 'after' ? index + 1 : index
    } else {
      index = this.insertIndex
    }

    const result = insertAt(source, index, destination, {
      allowDuplicates: this.allowDuplicates,
    })
    return new IndexMergerClass().addRules(this.rules).operate(result, result)
  }
}
