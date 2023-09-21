import { AbstractStrategy } from '@/src/strategies/abstract-strategy'

export const DELETE_MARKER = Symbol('delete')

export class RemoveStrategy extends AbstractStrategy {
  protected condition?: (value: unknown) => boolean

  public operate(_destination, source) {
    if (!this.condition) {
      return DELETE_MARKER
    }

    return this.condition(source) ? DELETE_MARKER : source
  }

  public withCondition(condition: NonNullable<typeof this.condition>) {
    this.condition = condition
    return this
  }
}
