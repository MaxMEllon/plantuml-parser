import P, { Parser } from 'parsimmon'

export function lexme<T>(p: Parser<T>) {
  return p.skip(P.optWhitespace)
} 

export function* rangeStr(s: string, e: string) {
  for (let i = s.charCodeAt(0); i < e.charCodeAt(0); i++) {
    return yield String.fromCharCode(i)
  }
}