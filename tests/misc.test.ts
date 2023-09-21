import { expect, test } from 'vitest'

import { mergeStrategy } from '@/src/factory'

test('if inner merge strategy defined the outer strategy should use a default strategy', () => {
  const source = { foo: { bar: false }, one: 1 }
  const destination = { foo: { bar: true }, one: 2 }
  const result = { foo: { bar: false }, one: 2 }
  const mergeResult = mergeStrategy(destination, source, (f) => ({
    foo: f.fallback(),
  }))
  expect(mergeResult).toStrictEqual(result)
})

test('when no strategy is defined for a literal object, will use the defaults', () => {
  const source = { foo: { bar: false, diff: true }, one: 1, diff: true }
  const destination = { foo: { bar: true }, one: 2, diffDest: true }
  const result = {
    foo: { bar: true, diff: true },
    one: 2,
    diff: true,
    diffDest: true,
  }
  const mergeResult = mergeStrategy(destination, source)
  expect(mergeResult).toStrictEqual(result)
})

test('when no strategy is defined for an array, will use the defaults', () => {
  const source = [
    { foo: { bar: false, diff: true }, one: 1, diff: true },
    'foo',
  ]
  const destination = [{ foo: { bar: true } }, 'foo', 'new']
  const result = [
    { foo: { bar: true, diff: true }, one: 1, diff: true },
    'foo',
    'new',
  ]
  const mergeResult = mergeStrategy(destination, source)
  expect(mergeResult).toStrictEqual(result)
})
