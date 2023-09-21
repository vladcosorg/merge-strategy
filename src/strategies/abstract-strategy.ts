import type { Strategy } from '@/src/strategies/strategy'

export abstract class AbstractStrategy implements Strategy {
  protected rules: any = {}

  public addRules(rules: any) {
    this.rules = rules
    return this
  }
  abstract operate(destination: unknown, source: unknown)
}
