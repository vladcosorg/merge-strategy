import { expect, test } from 'vitest'

import { mergeStrategyNew } from '@/src/factory'

test('a', () => {
  const source = { foo: { bar: false }, one: 1 }
  const destination = { foo: { bar: true }, one: 2 }
  const result = { foo: { bar: false }, one: 2 }
  const mergeResult = mergeStrategyNew(destination, source, (factory) => ({
    foo: factory.fallback(),
  }))
  expect(mergeResult).toStrictEqual(result)
})
