import { findIndex, findLastIndex } from 'lodash'
import { describe, expect, test } from 'vitest'

import { mergeStrategy } from '@/src/factory'
import type { ArrayStrategyConfig } from '@/src/strategies/array-strategy'
import { ArrayStrategy } from '@/src/strategies/array-strategy'

describe('array merge strategy', () => {
  describe('merge by insertion', () => {
    test.each<{
      config: ArrayStrategyConfig
      [index: string]: unknown
    }>([
      {
        title: 'should transform single value to a collection if necessary',
        source: 3,
        destination: 4,
        expected: [3, 4],
        config: { allowDuplicates: true, insertMethod: 'after' },
      },
      {
        title: 'should insert at the end and skip duplicates',
        destination: [3, 4],
        expected: [1, 2, 3, 4],
        config: { allowDuplicates: false, insertMethod: 'after' },
      },
      {
        title: 'should insert even beyound the length of an array',
        destination: [3, 4],
        expected: [1, 2, 3, 3, 4],
        config: {
          allowDuplicates: true,
          insertMethod: 'after',
          insertIndex: 4,
        },
      },
      {
        title: 'should insert at the index found by the predicate',
        destination: [3, 4],
        expected: [1, 2, 3, 4, 3],
        config: {
          allowDuplicates: true,
          insertMethod: 'after',
          insertIndex: (currentRow) => currentRow === 2,
        },
      },
      {
        title: 'should force insert if not found',
        destination: [3, 4],
        expected: [1, 2, 3, 3, 4],
        config: {
          allowDuplicates: true,
          insertMethod: 'after',
          insertIndex: (currentRow) => false,
        },
      },

      {
        title: 'should skip  if not found',
        destination: [3, 4],
        expected: [1, 2, 3],
        config: {
          allowDuplicates: true,
          insertMethod: 'after',
          ifNotFound: 'skip',
          insertIndex: (currentRow) => false,
        },
      },
      {
        title: 'should error  if not found',
        destination: [3, 4],
        expected: Error,
        config: {
          allowDuplicates: true,
          insertMethod: 'after',
          ifNotFound: 'error',
          insertIndex: (currentRow) => false,
        },
      },
      {
        title: 'should work with findIndex lodash func',
        destination: [{ user: 'jack', active: true }],
        expected: [
          { user: 'barney', active: true },
          { user: 'jack', active: true },
          { user: 'fred', active: true },
          { user: 'pebbles', active: false },
        ],
        source: [
          { user: 'barney', active: true },
          { user: 'fred', active: true },
          { user: 'pebbles', active: false },
        ],
        config: {
          allowDuplicates: true,
          insertMethod: 'after',
          searchFunction: findIndex,
          insertIndex: 'active',
        },
      },
      {
        title: 'should work with findLastIndex lodash func',
        destination: [{ user: 'jack', active: true }],
        expected: [
          { user: 'barney', active: true },
          { user: 'fred', active: true },
          { user: 'jack', active: true },
          { user: 'pebbles', active: false },
        ],
        source: [
          { user: 'barney', active: true },
          { user: 'fred', active: true },
          { user: 'pebbles', active: false },
        ],
        config: {
          allowDuplicates: true,
          insertMethod: 'after',
          searchFunction: findLastIndex,
          insertIndex: 'active',
        },
      },
      {
        title: 'should stop at first match',
        destination: [3, 4],
        expected: [1, 3, 4, 2, 3],
        config: {
          allowDuplicates: true,
          insertMethod: 'after',
          insertIndex: () => true,
        },
      },
      {
        destination: [3, 4],
        expected: [1, 2, 3, 3, 4],
        config: { allowDuplicates: true, insertMethod: 'after' },
      },
      {
        destination: [3, 4],
        expected: [3, 4, 1, 2, 3],
        config: { allowDuplicates: true, insertMethod: 'before' },
      },
      {
        destination: [3, 4],
        expected: [4, 1, 2, 3],
        config: { allowDuplicates: false, insertMethod: 'before' },
      },
    ])('$title', ({ destination, expected, config, source }) => {
      const exec = () =>
        mergeStrategy(
          destination,
          source ?? [1, 2, 3],
          (factory) => new ArrayStrategy(config),
        )

      if (config?.ifNotFound === 'error') {
        expect(exec).toThrowError()
      } else {
        expect(exec()).toStrictEqual(expected)
      }
    })
  })
  describe('merge by index', () => {
    test('scalars', () => {
      expect(mergeStrategy([3], [1, 2, 3])).toStrictEqual([3, 2, 3])
    })
    test('plain objects', () => {
      expect(mergeStrategy([{ one: 1 }], [{ one: 0, two: 2 }])).toStrictEqual([
        { one: 1, two: 2 },
      ])
    })
    test('nested arrays', () => {
      expect(mergeStrategy([[1]], [[0, 1], [2]])).toStrictEqual([[1, 1], [2]])
    })
  })

  describe('deep value merger', () => {
    const fun1Simialr = {
      name: '@astrojs/vue',
      config: () => 1,
    }

    const fun2Simialr = {
      name: '@astrojs/vue',
      config: () => 2,
    }

    const fun2 = {
      name: '@astrojs/react',
      config: () => 1,
    }

    const fun3 = {
      name: '@astrojs/svetle',
      config: () => 1,
    }
    test('existing objects should be replaced with their destination counterparts and preserve the index', () => {
      const result = mergeStrategy(
        [fun2Simialr],
        [fun2, fun1Simialr],
        (factory) => factory.uniqueArray(),
      )
      expect(result).toStrictEqual([fun2, fun2Simialr])
      expect(result[1].config()).toBe(2)
    })
    test('the merger should handle object additions and append them', () => {
      expect(
        mergeStrategy([fun2Simialr, fun3], [fun2, fun1Simialr], (factory) =>
          factory.uniqueArray(),
        ),
      ).toStrictEqual([fun2, fun2Simialr, fun3])
    })
    test('the merger should handle non-object values among the merge candidates', () => {
      expect(
        mergeStrategy(
          [fun2Simialr, fun3],
          [fun2, fun1Simialr, 1, fun3],
          (factory) => factory.uniqueArray(),
        ),
      ).toStrictEqual([fun2, fun2Simialr, 1, fun3])
    })
  })

  test('merge by replacement strategy', () => {
    expect(
      mergeStrategy([3], [1, 2, 3], (factory) => factory.replace()),
    ).toStrictEqual([3])
  })
})
