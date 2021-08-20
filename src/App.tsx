import React, { useState } from "react";
import { Button } from 'antd'

import { content3 } from './assets/resources2'
import { leftMenu } from './assets/leftMenu'

const errorWords = [
  'единственного',
  'предоставляют',
  'принимать',
  'допускается',
  'привилегированных',
  'обыкновенные',
  'Тип',
  'обществах',
  'статус'
]

let errorWordsWithParts: string[] = []

const App = () => {
  const [display, setDisplay] = useState(true)
  
  /**
   * get only text content, without symbols and numbers
   *
   * @param {string} content - innerText content
   * @return {string}
   */
  const getCleanContent = (content: any) => {
    // console.log('content before', content)
    const newContent = content
      .replace(/ /g, ' ')
      .replace(/\s+/gi, ' ')
      .replace(/[:;,<>/"'`–«»+=&№?%(){}\[\]*^@!A-Za-z0-9_]/g, '')
      .replace(/(\s-|-\s)/g, '') //убираем дефис вначале и конце слов, при этом осталяя их в середине
      .replace(/[.]/g, '##')
      .replace(/(^##|##$)/g, '') //тремируем текст, удаляем лишние знаки вначале и конце
      .replace(/\s##+/g, ' ')
      .replace(/##+\s/g, ' ')
    // console.log('content', newContent)
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
      .replace(/[:;,<>/"'`–«»+=&№?%(){}\[\]*^@!A-Za-z0-9_]/g, '')
      .replace(/(\s-|-\s)/g, '') //убираем дефис вначале и конце слов, при этом осталяя их в середине
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
    // wordsSet.delete('-')
    const wordArr = Array.from(wordsSet)
    console.log('getUniqWordArr', wordArr.sort())
    return wordArr
  }

  const getSeparatedWords = (wordsArr: any) => {
    const separatedWordsArr = wordsArr.filter((word: any) => word.includes('##'))
    console.log('separatedWordsArr', separatedWordsArr)
    if (!separatedWordsArr.length) return null
    const separatedWords: any = {}
    separatedWordsArr.forEach((word: any) => {
      const cleanWord = word.replace(/##/g, '')
      separatedWords[cleanWord] = word.split('##')
    })
    console.log('separatedWords', separatedWords)
    return separatedWords
  }
  
  function flattenSeparatedWords(separatedWordsObj: any) {
    return Object.keys(separatedWordsObj).reduce((accum, currentKey) => {
      return accum.concat(separatedWordsObj[currentKey])
    }, [])
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

  const addErrorClassToWordsPart = (separatedWords: any, content: any) => {
    const highLightError = (content: any, wordPartArr: any) => {
      return wordPartArr.reduce((accumContent: any, curWordPart: any) => {
        const newContent = accumContent.replace(curWordPart, `<span class="misspelledWord">${curWordPart}</span>`)
        const index = newContent.indexOf('<span class="misspelledWord"')
        console.log('newContent', newContent.slice(index - 30, index + 100))
        return newContent
      }, content)
    }

    const updateContent = (curContent: any, errorWord: any): any => {
      if (curContent.includes('Правовой <span class="misspelledWord">статус')) {
        // debugger
      }
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
  
  function handleRemoveErrors(containersList: any) {
    if (!containersList.length) return null
    console.log('handleRemoveErrors')
    for(let i = 0; i < containersList.length; i++) {
      containersList[i].innerHTML = errorWordsWithParts.reduce((accum, currentValue) => {
        const replaceRegExp = new RegExp(`<span class="misspelledWord">${currentValue}</span>`, 'g')
        const newAccum = accum.replace(replaceRegExp, currentValue)
        return newAccum
      }, containersList[i].innerHTML)
    }
    initSpellCheckScript()
  }
  
  const checkMisspelledWords = (containerElementList: any) => {
    console.log('start script')
  
    const mainContainer = document.querySelector('.qd-carcass')
    if (!mainContainer) return
    // const textContent = mainContainer.innerText
    const rawContent = mainContainer.innerHTML
  
    const content = getCleanContentFromHTML(rawContent)
    const wordArr = getUniqWordArr(content)
    const separatedWords = getSeparatedWords(wordArr)
    
    // добавляем части в массив для дальшейшей очистки (вынести в отдельную функцию)
    const wordsPart = flattenSeparatedWords(separatedWords)
    errorWordsWithParts = errorWords.concat(wordsPart)
    
    containerElementList.forEach((elementItem: any) => {
      const contentFirstStepUpdate = addErrorClass(elementItem.innerHTML, errorWords)
      const contentWithWordsPart = addErrorClassToWordsPart(separatedWords, contentFirstStepUpdate)
      elementItem.innerHTML = contentWithWordsPart
    })
  }

  function initSpellCheck(editButton: any) {
    console.log('initSpellCheck', editButton)
    const mainContainer = document.querySelector('.qd-carcass')

    if (mainContainer) mainContainer.setAttribute('spellcheck', String(false))
    editButton.addEventListener('click', checkEditMode, false)
  }

  function checkEditMode() {
    const timer = setInterval(() => {
      const containerNodeElementList1 = document.querySelectorAll('.qd-es-text')
      const containerNodeElementList2 = document.querySelectorAll('.paragraph')
      // const selectAllButton = document.querySelector('.qd-select-all-button')

      if (
        !containerNodeElementList1.length ||
        !containerNodeElementList2.length
        // !selectAllButton
      )
        return

      const containerElementList1 = Array.from(containerNodeElementList1)
      const containerElementList2 = Array.from(containerNodeElementList2)

      const containerElementList = containerElementList1.concat(containerElementList2)

      if (containerElementList.length) {
        clearInterval(timer)
        // console.log('containerElementList', containerElementList)
        checkMisspelledWords(containerElementList)
        initBtnEditAction(containerElementList)
      }
    }, 1000)
  }

  function initBtnEditAction(containerElementList: any) {
    console.log('initBtnEditAction')
    const interval = setInterval(() => {
      const editButtonActive = document.querySelector('.qd-carcass-btn-edit-active')
      if (editButtonActive) {
        editButtonActive.addEventListener(
          'click',
          function () {
            handleRemoveErrors(containerElementList)
          },
          false
        )
        clearInterval(interval)
      }
    }, 500)
  }

  function initSpellCheckScript() {
    const carcassBtnEditTimer = setInterval(() => {
      const editButton = document.querySelector('.qd-carcass-btn-edit')
      if (editButton) {
        initSpellCheck(editButton)
        clearInterval(carcassBtnEditTimer)
      }
    }, 500)
  }

  initSpellCheckScript()

  // qd-es-text
  return (
    <div>
      <button className="qd-carcass-btn-edit">Edit mode</button>
      <button className="qd-carcass-btn-edit-active">Normal mode</button>
      <button onClick={() => setDisplay(!display)}>display</button>
      <br />
      <div className='qd-carcass' style={{ display: display ? 'flex' : 'none' }}>
        <div style={{ minWidth: 400, margin: 10 }} dangerouslySetInnerHTML={{ __html: leftMenu }} />
        <div style={{ margin: 10 }} className="container" dangerouslySetInnerHTML={{ __html: content3 }} />
      </div>
      <br />
      <br />
      <div className="text" />
    </div>
  )
}

export default App
