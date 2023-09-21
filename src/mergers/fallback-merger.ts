import { AbstractMerger } from '@/src/mergers/abstract-merger'

export class FallbackMerger extends AbstractMerger {
  public operate(destination: unknown, source: unknown) {
    if (source === undefined) {
      return destination
    }

    return source
  }
}
