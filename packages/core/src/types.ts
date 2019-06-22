export type VisibilityChars = '-' | '+' | '#' | '~'

export type Visibility = 'private' | 'public' | 'protected' | 'package'

export type ClassPropertyAST = {
  name: string
  type: string
  visibility: Visibility
}

export type ClassAST = {
  class: {
    name: string
    body: {
      properties?: ClassPropertyAST[]
      methods?: never[] // TODO
    }
  }
}

export type AST = ['@startuml', ClassAST[], '@enduml']
