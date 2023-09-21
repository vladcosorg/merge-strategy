import { AbstractMerger } from '@/src/mergers/abstract-merger'
import { ArrayMerger } from '@/src/mergers/array-merger'
import { DefaultMerger } from '@/src/mergers/default-merger'
import { FallbackMerger } from '@/src/mergers/fallback-merger'
import { ReplacingMerger } from '@/src/mergers/replacing-merger'

export const strategyFactory = {
  fallback: () => new FallbackMerger(),
  replace: () => new ReplacingMerger(),
  objectArray: () => new ArrayMerger(),
  uniqueArray: () => new ArrayMerger().overwriteDuplicates(),
}

export function mergeStrategyNew<D, S>(
  destination: D,
  source: S,
  strategy?: (factory: typeof strategyFactory) => any,
): D & S {
  if (typeof strategy === 'function') {
    strategy = strategy(strategyFactory)
  }

  if (!(strategy instanceof AbstractMerger)) {
    strategy = new DefaultMerger(strategy ?? {})
  }

  return strategy.operate(destination, source)
}

export function mergeStrategy<D, S>(
  destination: D,
  source: S,
  strategy?: D & S,
): D & S {
  if (!strategy || typeof strategy !== 'function') {
    strategy = new DefaultMerger(strategy ?? [])
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
