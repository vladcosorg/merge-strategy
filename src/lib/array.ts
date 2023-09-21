import { isEqual } from 'lodash'

import { IndexMergerClass } from '@/src/mergers/index-merger'

export function ensureArray<T>(input: T | T[]): T[]{
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
    destination: newValues
  }
}

function insertAt<T extends unknown[], N extends unknown[]>(
  source: T,
  index: number,
  destination: N,
  {allowDuplicates = true}: {
    allowDuplicates?: boolean
  } = {}
) {


  if (!allowDuplicates){

    const deduped =  replaceDuplicates(destination, source)
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

export function createInsertionArrayMerger({
                                             allowDuplicates = false,
                                             insertMethod = 'after',
                                             insertIndex,
                                             searchFunction,
                                             ifNotFound = 'insert',
                                             wrapUnwrap = false,
                                           }: {
  allowDuplicates?: boolean
  insertMethod?: 'after' | 'before'
  insertIndex?: number | ((currentRow: unknown, currentIndex: number) => number)
  searchFunction?: (input, predicate) => number
  ifNotFound: 'error' | 'insert' | 'skip'
  wrapUnwrap: boolean
} = {}) {
  return function <T extends unknown[] | unknown>(
    maybeDestination: T,
    maybeSource: T,
    rules: any,
  ) {
    const destination = ensureArray(maybeDestination)
    const source = ensureArray(maybeSource)
    let index
    if (insertIndex === undefined) {
      index = insertMethod === 'after' ? destination.length + 1 : 0
    } else if (
      typeof insertIndex === 'function' ||
      typeof searchFunction === 'function'
    ) {
      searchFunction ??= defaultSearchFunction

      index = searchFunction(source, insertIndex)

      if (index < 0) {
        switch (ifNotFound) {
          case 'insert': {
            index = insertMethod === 'after' ? destination.length : 0
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

      index = insertMethod === 'after' ? index + 1 : index
    } else {
      index = insertIndex
    }

    const result =  insertAt(source, index, destination, {allowDuplicates})
    return  new IndexMergerClass().addRules(rules).operate(result, result)
  }
}


 function deepValueMerger<T extends Array<Record<string, unknown>>>(
  destination: T,
  source: T,
  rules: any,
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

  output.push(...newValues)

  return output
}