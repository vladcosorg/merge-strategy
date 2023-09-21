import { test, expect } from 'vitest'

import { mergeStrategyNew } from '@/src/factory'

test.skip('object', () => {
  const source = { foo: { bar: false, diff: true } }
  const destination = { foo1: { bar: false, diff: true } }
  const result = [
    { foo: { bar: true, diff: true }, one: 1, diff: true },
    'foo',
    'new',
  ]
  const mergeResult = mergeStrategyNew(destination, source, (f) => ({
    foo: f.replace(),
    foo1: f.fallback(),
  }))

  expect(mergeResult).toStrictEqual(result)
})
