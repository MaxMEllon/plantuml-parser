import P, { Parser } from 'parsimmon'

export function skipOptWs<T>(p: Parser<T>) {
  return p.skip(P.optWhitespace)
}

export function orOptWs<T>(p: Parser<T>) {
  return p.or(P.optWhitespace)
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
