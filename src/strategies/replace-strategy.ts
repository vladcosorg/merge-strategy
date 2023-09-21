import { AbstractStrategy } from '@/src/strategies/abstract-strategy'

export class ReplaceStrategy extends AbstractStrategy {
  public operate(destination: unknown) {
    return destination
  }
}
