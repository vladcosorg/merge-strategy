export type MergeReturnType<D, S> =     (
  destination: D,
  source: S,
  rules: any,
)  => void


export function replacingMerger(destination: unknown) {
  return destination
}

export function createFallbackMerge<D, S>(): MergeReturnType<D, S>{
  return function(destination: unknown, source: unknown){
    if (source === undefined){
      return destination
    }

    return source
  }
}



