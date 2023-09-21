import { expect, test } from 'vitest'

import { mergeStrategy, strategyFactory } from '@/src'
import type { RemoveStrategy } from '@/src/strategies/remove-strategy'

const destination = { foo: true }
const source = { toRemove: true, toKeep: true }

function createStrategy(strategy: RemoveStrategy) {
  return mergeStrategy(destination, source, () => ({
    toRemove: strategy,
  }))
}

test('should remove the element with the delete marker', () => {
  expect(createStrategy(strategyFactory.remove())).toStrictEqual({
    foo: true,
    toKeep: true,
  })
})

test('should remove the element with a conditional delete marker if the condition is true', () => {
  expect(
    createStrategy(
      strategyFactory.remove().withCondition((value) => value === true),
    ),
  ).toStrictEqual({ foo: true, toKeep: true })
})

test('should remove the element with a conditional delete marker if the condition is not true', () => {
  expect(
    createStrategy(
      strategyFactory.remove().withCondition((value) => value === false),
    ),
  ).toStrictEqual({ foo: true, toKeep: true, toRemove: true })
})
