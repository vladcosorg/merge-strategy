import type { Merger } from '@/src/mergers/merger'

export abstract class AbstractMerger implements Merger {
  protected rules: any = {}

  public addRules(rules: any) {
    this.rules = rules
    return this
  }
  abstract operate(destination: unknown, source: unknown)
}
