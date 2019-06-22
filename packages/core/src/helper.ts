import { Parser } from 'parsimmon'

export function skip<T>(p: Parser<T>) {
  return <U>(x: Parser<U>) => x.skip(p)
}

export function or<T>(p: Parser<T>) {
  return <U>(x: Parser<U>) => x.or(p)
}

export function then<T>(p: Parser<T>) {
  return <U>(x: Parser<U>) => x.then(p)
}

export function mapper<T, U>(mapper: (t: T) => U) {
  return (parser: Parser<T>): Parser<U> => parser.map(mapper)
}

export function many<T>(parser: Parser<T>) {
  return parser.many()
}

export function* rangeStr(s: string, e: string) {
  for (let i = s.charCodeAt(0); i < e.charCodeAt(0); i++) {
    return yield String.fromCharCode(i)
  }
}
