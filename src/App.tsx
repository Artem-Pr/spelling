import React from 'react'
import { useQuill } from 'react-quilljs'
import { Button } from 'antd'

import 'quill/dist/quill.snow.css'
import { content, content2 } from './assets/resources'

const config = {
  placeholder: 'Compose an epic...',
  theme: 'snow',
  formats: ['underline']
  // modules: {
  //   toolbar: false
  // }
}

const errorWords = ['предоставляют', 'принимать', 'допускается', 'привилегированных', 'обыкновенные', 'Тип']

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

  const getCleanContent = (rawContent: any) => {
    const content = rawContent
      // .replace(/&nbsp;/g, ' ')
      // .replace(/&quot;/g, ' ')
      // .replace(/\./g, '')
      // .replace(/,/g, '')
      // .replace(/\s<\/?b[^>]*>/g, ' ')
      // .replace(/<\/?b[^>]*>\s/g, ' ')
      // .replace(/(\s##|##\s)/g, ' ')
      // .replace(/(<([^>]+)>)/g, '')
      .replace(/(&nbsp;|&quot;)/g, ' ')
      .replace(/[.;,\-"'`#&?%()*^@!0-9]/g, '')
      .replace(/<\/?(p|div|input)[^>]*>/g, ' ')
      .replace(/<\/?(b|span|a)[^>]*>/g, '##')
      .replace(/\s##+/g, ' ')
      .replace(/##+\s/g, ' ')
      .replace(/\s{2,}/gi, ' ')
    // console.log('content', content)
    return content
  }

  const getUniqWordArr = (content: any) => {
    const preparedArr = content
      .trim()
      .split(' ')
      .map((word: any) => word.toLowerCase())
    const wordArr = Array.from(new Set(preparedArr))
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

  // const addErrorClass = (rawContent: any, errorsArr: any) => {
  //   return errorsArr.reduce((accumContent: any, curError: any) => {
  //     const regexp = new RegExp(curError, 'g')
  //     return accumContent.replace(regexp, `<span class="error">${curError}</span>`)
  //   }, rawContent)
  // }

  const addCapitalizedWords = (wordsArr: any) => {
    return [...wordsArr, ...wordsArr.map((word: any) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`)]
  }

  const isErrorInsideTag = (content: any) => {
    const openTagPos = content.lastIndexOf('<')
    const closeTagPos = content.lastIndexOf('>')
    const isNotFind = openTagPos === -1 && closeTagPos === -1
    // const open = openTagPos === -1 ? 0 : openTagPos
    // const close = closeTagPos === -1 ? 0 : closeTagPos
    return isNotFind ? -1 : openTagPos > closeTagPos
  }
  
  // const replaceFirstOccurrence = (content: any, errorWord: any) => {
  //   const regexp = new RegExp(errorWord)
  //   return content.replace(regexp, `<span class="error">${errorWord}</span>`)
  // }

  const addErrorClass = (rawContent: any, errorsArr: any) => {
    const openTag = '<span class="error">'
    const closeTag = '</span>'
    
    return errorsArr.reduce((accumContent: any, curError: any) => {
      // if (curError === 'Тип') debugger
      const contentParts = accumContent.split(curError)
      let isOmitPreviousPart: any = true
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

  // const addErrorTagsToContent = (errorWord: any, content: any) => {
  //   const errorPosition = content.indexOf(errorWord)
  //   const isOmitThisCase = isErrorInsideTag(content.slice(0, errorPosition))
  //   const nextContent = content.slice(errorPosition + errorWord.length)
  //   const curContent = content.slice()
  //   const updatedContent = isOmitThisCase ? content : replaceFirstOccurrence(content, errorWord)
  //
  // }
  //
  // const addErrorClass = (rawContent: any, errorsArr: any) => {
  //   return errorsArr.reduce((accumContent: any, curError: any) => {}, rawContent)
  // }

  const handleCheck = () => {
    const containerElement = document.querySelector(`.container`)
    const rawContent = containerElement ? containerElement.innerHTML : undefined
    const textContainer = document.querySelector(`.text`)
    if (!rawContent || !textContainer) return

    const content = getCleanContent(rawContent)
    textContainer.innerHTML = content

    const wordArr = getUniqWordArr(content)
    const separatedWords = getSeparatedWords(wordArr)

    // const errors = addCapitalizedWords(errorWords)
    // console.log('errors', errors)
    
    if (containerElement) containerElement.innerHTML = addErrorClass(containerElement.innerHTML, errorWords)
  }

  return (
    <div style={{ width: 700, height: 300, padding: 20 }} spellCheck="false">
      <div ref={quillRef} />
      <Button onClick={handleSet}>set</Button>
      <Button onClick={handleCheck}>check</Button>
      <div className="container" dangerouslySetInnerHTML={{ __html: content2 }} />
      <br />
      <br />
      <div className="text" />
    </div>
  )
}

export default App
