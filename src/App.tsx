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

const errorWords = ['предоставляют', 'принимать', 'допускается', 'привилегированных', 'обыкновенные', 'Тип', 'обществах']

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

  const isErrorInsideTag = (content: any) => {
    const openTagPos = content.lastIndexOf('<')
    const closeTagPos = content.lastIndexOf('>')
    const isNotFind = openTagPos === -1 && closeTagPos === -1
    return isNotFind ? -1 : openTagPos > closeTagPos
  }

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
  
  const removeWordsPart = (wordArr: any) => {
    const wordsWithOutPartSeparators = wordArr.map((word: any) => word.replace(/##/g, ''))
    return Array.from(new Set(wordsWithOutPartSeparators))
  }
  
  const addErrorClassToWordsPart = (separatedWords: any, content: any) => {
    const highLightError = (content: any, wordPartArr: any, errorWord: any) => {
      return wordPartArr.reduce((accumContent: any, curWordPart: any) => {
        // debugger
        const newContent = accumContent.replace(curWordPart, `<span class="error" data-error-part="">${curWordPart}</span>`)
        const index = newContent.indexOf('<span class="error" data-error-part')
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
      const cleanContentPart = getCleanContent(contentPart)
      const isRightPlace = cleanContentPart.startsWith(separatedWords[errorWord].join('##'))
      if (isRightPlace) {
        const curContentWithTags = highLightError(contentPart, separatedWords[errorWord], errorWord)
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
    const containerElement = document.querySelector(`.container`)
    const rawContent = containerElement ? containerElement.innerHTML : undefined
    const textContainer = document.querySelector(`.text`)
    if (!rawContent || !textContainer) return

    const content = getCleanContent(rawContent)
    // textContainer.innerHTML = content

    const wordArr = getUniqWordArr(content)
    const wordsForChecking = removeWordsPart(wordArr)
    console.log('wordsForChecking', wordsForChecking)
    
    if (containerElement) containerElement.innerHTML = addErrorClass(containerElement.innerHTML, errorWords)
  }
  
  const handleCheckParts = () => {
    const containerElement = document.querySelector(`.container`)
    const rawContent = containerElement ? containerElement.innerHTML : undefined
    if (!rawContent) return
    
    const content = getCleanContent(rawContent)
    const wordArr = getUniqWordArr(content)
    
    if (containerElement) {
      const separatedWords = getSeparatedWords(wordArr)
      containerElement.innerHTML = addErrorClassToWordsPart(separatedWords, rawContent)
      // addErrorClassToWordsPart(separatedWords, rawContent)
    }
  }

  return (
    <div style={{ width: 700, height: 300, padding: 20 }} spellCheck="false">
      <div ref={quillRef} />
      <Button onClick={handleSet}>set</Button>
      <Button onClick={handleCheck}>check</Button>
      <Button onClick={handleCheckParts}>check word parts</Button>
      <div className="container" dangerouslySetInnerHTML={{ __html: content2 }} />
      <br />
      <br />
      <div className="text" />
    </div>
  )
}

export default App
