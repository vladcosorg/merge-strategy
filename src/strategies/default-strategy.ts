import { isArray, isPlainObject } from 'lodash'

import { AbstractStrategy } from '@/src/strategies/abstract-strategy'
import { MergeIndexesStrategy } from '@/src/strategies/merge-indexes-strategy'

export class DefaultStrategy extends AbstractStrategy {
  constructor(protected rules: any = {}) {
    super()
    this.addRules(rules)
  }

  operate(destination: unknown, source: unknown) {
    if (
      !isArray(destination) &&
      !isArray(source) &&
      !isPlainObject(destination) &&
      !isPlainObject(source)
    ) {
      return destination
    }

    return new MergeIndexesStrategy()
      .addRules(this.rules)
      .operate(destination, source)
  }
}
