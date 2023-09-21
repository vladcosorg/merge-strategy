import { AbstractMerger } from '@/src/mergers/abstract-merger'

export class ReplacingMerger extends AbstractMerger {
  public operate(destination: unknown) {
    return destination
  }
}
