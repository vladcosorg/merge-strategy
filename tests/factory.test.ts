import { expect, test } from 'vitest'

import { createPartialMergeWithDestination } from '@/src/factory'

test('create a partially applied merge function and then run it', () => {
  const compiledDestination = createPartialMergeWithDestination({ foo: true })
  expect(compiledDestination({ bar: true })).toStrictEqual({
    bar: true,
    foo: true,
  })
})
