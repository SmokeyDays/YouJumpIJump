export enum LimitType {
  EQUAL,
  LARGE,
  LARGE_EQUAL,
  LESS,
  LESS_EQUAL,
  NOT_EQUAL,
  AND,
  OR,
  NOT
}

export type Limit<T> = {
  type: LimitType.EQUAL,
  value: number,
}