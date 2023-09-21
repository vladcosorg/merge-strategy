import { test, expect } from 'vitest'

import { mergeStrategy } from '@/src/factory'

test('array', () => {
  const source = [{ foo: true }]
  const destination = [{ foo: false }]
  const result = [{ foo: true }]
  const mergeResult = mergeStrategy(destination, source, (f) => [
    {
      foo: f.fallback(),
    },
  ])

  expect(mergeResult).toStrictEqual(result)
})
