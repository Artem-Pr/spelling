export const Format = 123

// import { compose, map } from 'ramda'
//
// import { DeltaItem } from '../redux/types'

// const createDeltaArr = (insert: string, posStart: number, posEnd: number): DeltaItem[] => {
//   const firstLine = insert
// }
//
// const createDelta = (deltaItem: DeltaItem, misspelledWord: string): DeltaItem[] => {
//   const currentIdx = deltaItem.insert.indexOf(misspelledWord)
//
//   return currentIdx === -1 ? [deltaItem] : []
// }
//
// export const createContent = (currentContent: DeltaItem[], spellingMistakes: string[]): DeltaItem[] => {}

// export const deltaToStr = (delta: DeltaItem[]): string => {
//   return delta.reduce((accum: string, currentValue: DeltaItem) => {
//     return `${accum}${currentValue.insert}`
//   }, '')
// }
//
// export const createContent = (quill: any, spellingMistakes: string[]): DeltaItem[] => {
//   const content: DeltaItem[] = quill.getContents().ops
//   const contentSrt = deltaToStr(content)
//
// }
