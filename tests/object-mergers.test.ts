import { describe, expect, test } from 'vitest'

import { mergeStrategy } from '@/src/factory'

describe('object replacement strategy', () => {
  describe('merge by key', () => {
    test('regular nested object', () => {
      expect(
        mergeStrategy(
          {
            b: {
              c: 1,
            },
          },
          {
            a: 1,
            b: {
              d: 2,
            },
          },
        ),
      ).toStrictEqual({
        a: 1,
        b: {
          c: 1,
          d: 2,
        },
      })
    })
  })
  describe('merge by replacement', () => {
    test('regular nested object', () => {
      expect(
        mergeStrategy(
          {
            b: {
              c: 1,
            },
          },
          {
            a: 1,
            b: {
              d: 2,
            },
          },
          (factory) => ({
            b: factory.replace(),
          }),
        ),
      ).toStrictEqual({
        a: 1,
        b: {
          c: 1,
        },
      })
    })
  })
})
