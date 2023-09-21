import { AbstractStrategy } from '@/src/strategies/abstract-strategy'

export class FallbackStrategy extends AbstractStrategy {
  public operate(destination: unknown, source: unknown) {
    if (source === undefined) {
      return destination
    }

    return source
  }
}
