export type TableTab = 'list' | 'macros'

export type TableRowData = {
  communication?: import('./communicationTypes').Communication
  macro?: import('./communicationTypes').Macro
  index: number
}

