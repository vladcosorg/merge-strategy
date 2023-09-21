import { AbstractStrategy } from '@/src/strategies/abstract-strategy'
import { DefaultStrategy } from '@/src/strategies/default-strategy'
import { DELETE_MARKER } from '@/src/strategies/remove-strategy'

export class MergeIndexesStrategy extends AbstractStrategy {
  override operate(destination: unknown, source: unknown) {
    let output = this.addElements(
      source,
      source,
      Array.isArray(source) ? [] : {},
    )

    output = this.addElements(destination, source, output)

    return output
  }

  protected addElements(input: unknown, source: unknown, output: unknown) {
    for (const key of Array.isArray(input)
      ? input.keys()
      : Object.keys(input)) {
      const value = input[key]

      const currentRule = this.rules[key]
      const currentStrategy =
        currentRule instanceof AbstractStrategy
          ? currentRule
          : new DefaultStrategy()

      if (currentRule) {
        currentStrategy.addRules(this.rules[key])
      }

      const result = currentStrategy.operate(value, source[key])

      if (result !== DELETE_MARKER) {
        output[key] = result
      }
    }

    return output
  }
}
