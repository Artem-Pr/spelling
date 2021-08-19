import React from 'react'
import { useQuill } from 'react-quilljs'
import { Button } from 'antd'

import 'quill/dist/quill.snow.css'
import { content3 } from './assets/resources2'

const config = {
  placeholder: 'Compose an epic...',
  theme: 'snow',
  formats: ['underline']
  // modules: {
  //   toolbar: false
  // }
}

const errorWords = [
  'единственного',
  'предоставляют',
  'принимать',
  'допускается',
  'привилегированных',
  'обыкновенные',
  'Тип',
  'обществах'
]

function addClassToWordParts(className: any, content: any) {
  const dataAttribute = new RegExp('data-error-part="', 'g')
  return content.replace()
}

const App = () => {
  const { quill, quillRef } = useQuill(config)
  // const [text, setText] = useState('console.log(vom)')
  // const errorArr = ['and', 'the']

  const handleSet = () => {
    // eslint-disable-next-line functional/immutable-data
    // quillRef.current.children[0].innerHTML = '<div>dom-bom<u>insert</u>></div>'
    quill.setHTML('<div>Hello</div>')
    // quill.setContents([
    //   { insert: "console.log('delta', " },
    //   { insert: 'delta', attributes: { underline: true } },
    //   { insert: "\nconsole.log('oldDelta', oldDelta)" }
    // ])
  }

  quill &&
    quill.on('text-change', function (delta: any, oldDelta: any) {
      console.log('delta', delta)
      console.log('oldDelta', oldDelta)
      if (delta.ops[1] && delta.ops[1].insert === 'I') {
        quill.setText(oldDelta.ops[0].insert + ' Bom-bom')
      }
      // const content: DeltaItem[] = quill.getContents()
      // console.log('content', content)

      // console.log(quill.getHTML())
      console.log(quillRef.current.children[0].innerHTML)

      // if (delta.ops[1].insert === 'Q') {
      //   quill.getBounds(7)
      // }
    })

  /**
   * get only text content, without symbols and numbers
   *
   * @param {string} content - innerText content
   * @return {string}
   */
  const getCleanContent = (content: any) => {
    const newContent = content
      .replace(/(&nbsp;|&quot;)/g, ' ')
      // .replace(/[.:;,<>/\-"'`«»+=#&№?%(){}\[\]*^@!A-Za-z0-9_]/g, '')
      .replace(/\d/g, ' ')
      .replace(/\n/g, ' ')
      .replace(/ /g, ' ')
      // .replace(/<\/?(p|div|input)[^>]*>/g, ' ')
      .replace(/[.]/g, '##')
      // .replace(/<\/?(b|span|a)[^>]*>/g, '##')
      .replace(/\s##+/g, ' ')
      .replace(/##+\s/g, ' ')
      .replace(/\s{2,}/gi, ' ')
      .replace(/[.:;,<>/\-"'`–«»+=&№?%(){}\[\]*^@!A-Za-z0-9_]/g, '')
    // console.log('content', content)
    return newContent
  }

  const getCleanContentFromHTML = (rawContent: any) => {
    const content = rawContent
      .replace(
        /(&nbsp;|&quot;|&laquo;|&raquo;|&lsaquo;|&rsaquo;|&lsquo;|&rsquo;|&ldquo;|&rdquo;|&sbquo;|&bdquo;|&bull;|&middot;|&mdash;|&ndash;|&hellip;)/g,
        ' '
      ) //
      .replace(/\n/g, ' ')
      .replace(/[.:;,/\-"'`«»+=#&№?%(){}\[\]*^@!0-9_]/g, '')
      .replace(/<\/?(h|p|div|input|table|tbody|tr|td|th|thead|colgroup|col|form|label|img)[^>]*>/g, ' ')
      .replace(/<\/?(b|span|a|strong)[^>]*>/g, '##')
      .replace(/\s##+/g, ' ')
      .replace(/##+\s/g, ' ')
      .replace(/##{2,}/g, '##')
      .replace(/\s{2,}/gi, ' ')
    // console.log('content', content)
    return content
  }

  /**
   * get array of all uniq words from content
   *
   * @param {string} content - cleaned content (has only words, without symbols and numbers)
   * @return {array<string>} array fo uniq words
   */
  const getUniqWordArr = (content: any) => {
    const preparedArr = content.trim().split(' ')
    const wordsSet = new Set(preparedArr)
    wordsSet.delete('')
    const wordArr = Array.from(wordsSet)
    console.log('getUniqWordArr', wordArr)
    return wordArr
  }

  const getSeparatedWords = (wordsArr: any) => {
    const separatedWordsArr = wordsArr.filter((word: any) => word.includes('##'))
    if (!separatedWordsArr.length) return null
    const separatedWords: any = {}
    separatedWordsArr.forEach((word: any) => {
      const cleanWord = word.replace(/##/g, '')
      separatedWords[cleanWord] = word.split('##')
    })
    console.log('separatedWords', separatedWords)
    return separatedWords
  }

  /**
   * checks the error position, if the misspelled word is inside the tag, returns 'true'
   *
   * @param {string} content - part of HTML content starting with a misspelled word
   * @return {boolean}
   */
  const isErrorInsideTag = (content: any) => {
    const openTagPos = content.lastIndexOf('<')
    const closeTagPos = content.lastIndexOf('>')
    const isNotFind = openTagPos === -1 && closeTagPos === -1
    return isNotFind ? -1 : openTagPos > closeTagPos
  }

  /**
   * add Error class to misspelled words
   *
   * @param {string} rawContent - HTML content
   * @param {string[]} errorsArr - array of misspelled words
   * @return {string} HTML content with added Error classes
   */
  const addErrorClass = (rawContent: any, errorsArr: any) => {
    const openTag = '<span class="misspelledWord">'
    const closeTag = '</span>'

    return errorsArr.reduce((accumContent: any, curError: any) => {
      const contentParts = accumContent.split(curError)
      let isOmitPreviousPart: any = contentParts[0].includes('<')
      const contentWithTags = contentParts.map((part: any) => {
        const needOmitError = isErrorInsideTag(part)
        const isOmitThisPart = needOmitError === -1 ? isOmitPreviousPart : needOmitError
        const begin = isOmitPreviousPart ? '' : closeTag
        const end = isOmitThisPart ? '' : openTag
        isOmitPreviousPart = isOmitThisPart
        return `${begin}${part}${end}`
      })
      return contentWithTags.join(curError)
    }, rawContent)
  }

  /**
   * remove '##' separators from every word in array
   *
   * @param {string[]} wordArr
   * @return {string[]}
   */
  const removeWordsPart = (wordArr: any) => {
    const wordsWithOutPartSeparators = wordArr.map((word: any) => word.replace(/##/g, ''))
    return Array.from(new Set(wordsWithOutPartSeparators))
  }

  const addErrorClassToWordsPart = (separatedWords: any, content: any) => {
    const highLightError = (content: any, wordPartArr: any) => {
      return wordPartArr.reduce((accumContent: any, curWordPart: any) => {
        const newContent = accumContent.replace(
          curWordPart,
          `<span class="misspelledWord">${curWordPart}</span>`
        )
        const index = newContent.indexOf('<span class="misspelledWord"')
        console.log('newContent', newContent.slice(index - 30, index + 100))
        return newContent
      }, content)
    }

    const updateContent = (curContent: any, errorWord: any): any => {
      const firstSeparatedPart = separatedWords[errorWord][0]
      const startIdx = curContent.indexOf(firstSeparatedPart)
      if (startIdx === -1) return curContent
      const contentPart = curContent.slice(startIdx)
      const prevContentPart = curContent.slice(0, startIdx)
      const cleanContentPart = getCleanContentFromHTML(contentPart)
      const isRightPlace = cleanContentPart.startsWith(separatedWords[errorWord].join('##'))
      if (isRightPlace) {
        const curContentWithTags = highLightError(contentPart, separatedWords[errorWord])
        const nextPartIndex = curContentWithTags.indexOf(separatedWords[errorWord].slice(-1)[0])
        const curContentPart = curContentWithTags.slice(0, nextPartIndex)
        const nextContentPart = curContentWithTags.slice(nextPartIndex)
        return prevContentPart + curContentPart + updateContent(nextContentPart, errorWord)
      }
      const nextContentPart = contentPart.slice(firstSeparatedPart.length)
      return prevContentPart + firstSeparatedPart + updateContent(nextContentPart, errorWord)
    }

    return Object.keys(separatedWords).reduce((accumContent: any, curWord: any) => {
      return updateContent(accumContent, curWord)
    }, content)
  }

  const handleCheck = () => {
    const containerElement: HTMLElement | null = document.querySelector(`.container`)
    const rawContent = containerElement ? containerElement.innerText : undefined
    if (!rawContent) return

    const content = getCleanContent(rawContent)
    const wordArr = getUniqWordArr(content)
    const wordsForChecking = removeWordsPart(wordArr)
    console.log('wordsForChecking', wordsForChecking)

    if (containerElement) containerElement.innerHTML = addErrorClass(containerElement.innerHTML, errorWords)
  }

  const handleCheckParts = () => {
    const containerElement = document.querySelector(`.container`)
    const rawContent = containerElement ? containerElement.innerHTML : undefined
    if (!rawContent) return

    const content = getCleanContentFromHTML(rawContent)
    const wordArr = getUniqWordArr(content)
    console.log('wordArr', wordArr)

    if (containerElement) {
      const separatedWords = getSeparatedWords(wordArr)
      const contentWithWordsPart = addErrorClassToWordsPart(separatedWords, rawContent)
      containerElement.innerHTML = contentWithWordsPart
      // addErrorClassToWordsPart(separatedWords, rawContent)
    }
  }
  
  function handleRemoveErrors() {
    const containerElement = document.querySelector(`.container`)
    const rawContent = containerElement ? containerElement.innerHTML : undefined
    if (!rawContent) return
    if (containerElement) {
      containerElement.innerHTML = errorWords.reduce((accum, currentValue) => {
        const replaceRegExp = new RegExp(`<span class="misspelledWord">${currentValue}</span>`, 'g')
        return accum.replace(replaceRegExp, currentValue)
      }, rawContent)
    }
  }
  
  // qd-es-text
  return (
    <div style={{ width: 700, height: 300, padding: 20 }} spellCheck="false">
      <div ref={quillRef} />
      <Button onClick={handleSet}>set</Button>
      <Button onClick={handleCheck}>check</Button>
      <Button onClick={handleCheckParts}>check word parts</Button>
      <Button onClick={handleRemoveErrors}>remove errors</Button>
      <div className="container" dangerouslySetInnerHTML={{ __html: content3 }} />
      <br />
      <br />
      <div className="text" />
    </div>
  )
}

export default App
