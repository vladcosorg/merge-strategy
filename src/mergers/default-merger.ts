import { isArray, isPlainObject } from 'lodash'

import { AbstractMerger } from '@/src/mergers/abstract-merger'
import { IndexMergerClass } from '@/src/mergers/index-merger'

export class DefaultMerger extends AbstractMerger {
  constructor(protected rules: any = {}) {
    super()
    this.addRules(rules)
  }

  operate(destination: unknown, source: unknown) {
    if (isArray(destination) && isArray(source)) {
      return new IndexMergerClass()
        .addRules(this.rules)
        .operate(destination, source)
    } else if (isPlainObject(destination) && isPlainObject(source)) {
      return new IndexMergerClass()
        .addRules(this.rules)
        .operate(
          destination as Record<string, unknown>,
          source as Record<string, unknown>,
        )
    }

    return destination
  }
}
