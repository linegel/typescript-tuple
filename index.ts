/**
 * Get type of first element
 * @example `First<[0, 1, 2]>` → `0`
 */
export type First<Tuple extends [any, ...any[]]> = Tuple[0]

/**
 * Get type of last element
 * @example `Last<[0, 1, 2]>` → `2`
 */
export type Last<Tuple extends any[]> = utils.Last<Tuple>

/**
 * Add an element to the end of a tuple
 * @example `Append<[0, 1, 2], 'new'>` → `[0, 1, 2, 'new']`
 */
export type Append<Tuple extends any[], Addend> = Reverse<Prepend<Reverse<Tuple>, Addend>>

/**
 * Add an element to the beginning of a tuple
 * @example `Prepend<[0, 1, 2], 'new'>` → `['new', 0, 1, 2]`
 */
export type Prepend<Tuple extends any[], Addend> = utils.Prepend<Tuple, Addend>

/**
 * Reverse a tuple
 * @example `Reverse<[0, 1, 2]>` → `[2, 1, 0]`
 */
export type Reverse<Tuple extends any[]> = utils.Reverse<Tuple>

/**
 * Concat two tuple into one
 * @example `Concat<[0, 1, 2], ['a', 'b', 'c']>` → `[0, 1, 2, 'a', 'b', 'c']`
 */
export type Concat<Left extends any[], Right extends any[]> = utils.Concat<Left, Right>

/**
 * Repeat a certain type into a tuple
 * @example `Repeat<'foo', 4>` → `['foo', 'foo', 'foo', 'foo']`
 * @warning To avoid potential infinite loop, `Count` must be an integer greater than or equal to 0
 */
export type Repeat<Type, Count extends number> = utils.Repeat<Type, Count, []>

/**
 * Concat multiple tuples
 * @example `ConcatMultiple<[], [0], [1, 2], [3, 4, 5]>` → `[0, 1, 2, 3, 4, 5]`
 */
export type ConcatMultiple<TupleSet extends any[][]> = utils.ConcatMultiple<TupleSet>

export namespace utils {
  export type Last<Tuple extends any[], Default = never> = {
    empty: Default,
    single: Tuple extends [infer SoleElement] ? SoleElement : never,
    multi: ((..._: Tuple) => any) extends ((_: any, ..._1: infer Next) => any) ? Last<Next> : Default
  }[
    Tuple extends [] ? 'empty' : Tuple extends [any] ? 'single' : 'multi'
  ]

  export type Prepend<Tuple extends any[], Addend> =
    ((_: Addend, ..._1: Tuple) => any) extends ((..._: infer Result) => any) ? Result : never

  export type Reverse<Tuple extends any[], Prefix extends any[] = []> = {
    empty: Prefix,
    nonEmpty: ((..._: Tuple) => any) extends ((_: infer First, ..._1: infer Next) => any)
      ? Reverse<Next, Prepend<Prefix, First>>
      : never
  }[
    Tuple extends [any, ...any[]] ? 'nonEmpty' : 'empty'
  ]

  export type Concat<Left extends any[], Right extends any[]> = {
    emptyLeft: Right,
    singleLeft: Left extends [infer SoleElement]
      ? Prepend<Right, SoleElement>
      : never,
    multiLeft: ((..._: Reverse<Left>) => any) extends ((_: infer LeftLast, ..._1: infer ReversedLeftRest) => any)
      ? Concat<Reverse<ReversedLeftRest>, Prepend<Right, LeftLast>>
      : never
  }[
    Left extends [] ? 'emptyLeft' : Left extends [any] ? 'singleLeft' : 'multiLeft'
  ]

  export type Repeat<Type, Count extends number, Holder extends any[] = []> = {
    fit: Holder,
    unfit: Repeat<Type, Count, Prepend<Holder, Type>>
  }[
    Holder['length'] extends Count ? 'fit' : 'unfit'
  ]

  export type ConcatMultiple<TupleSet extends any[][]> = {
    empty: [],
    multi: ((..._: Reverse<TupleSet>) => any) extends ((_: infer Last, ..._1: infer ReversedRest) => any) ?
      Last extends any[] ?
      ReversedRest extends any[][] ?
        Concat<ConcatMultiple<Reverse<ReversedRest>>, Last> :
      never :
      never :
      never
  }[
    TupleSet extends [] ? 'empty' : 'multi'
  ]
}
