import { AbstractStrategy } from '@/src/strategies/abstract-strategy'
import { ArrayStrategy } from '@/src/strategies/array-strategy'
import { DefaultStrategy } from '@/src/strategies/default-strategy'
import { FallbackStrategy } from '@/src/strategies/fallback-strategy'
import { RemoveStrategy } from '@/src/strategies/remove-strategy'
import { ReplaceStrategy } from '@/src/strategies/replace-strategy'

export const strategyFactory = {
  fallback: () => new FallbackStrategy(),
  replace: () => new ReplaceStrategy(),
  objectArray: () => new ArrayStrategy(),
  uniqueArray: () => new ArrayStrategy().overwriteDuplicates(),
  remove: () => new RemoveStrategy(),
}

export function mergeStrategy<D, S>(
  destination: D,
  source: S,
  strategy?: (factory: typeof strategyFactory) => any,
): D & S {
  if (typeof strategy === 'function') {
    strategy = strategy(strategyFactory)
  }

  if (!(strategy instanceof AbstractStrategy)) {
    strategy = new DefaultStrategy(strategy ?? {})
  }

  return strategy.operate(destination, source)
}

export function createPartialMergeWithDestination<D, S>(
  destination: D,
  mergeConfig?: any,
) {
  return function (source: S) {
    return mergeStrategy(destination, source, mergeConfig)
  }
}
