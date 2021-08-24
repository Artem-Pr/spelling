import React, { useState } from 'react'

import { content3 } from './assets/resources2'
import { leftMenu } from './assets/leftMenu'

function createCode() {
  return Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0')
}

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
   * @param {string} rawContent - outer HTML content
   * @param {string[]} errorsArr - array of misspelled words
   * @return {string} HTML content with added Error classes
   */
  const addErrorClass = (rawContent: any, errorsArr: any) => {
    const removeExtraOpenTag = (content: any) => {
      return content.slice(0, content.lastIndexOf('<span class="misspelledWord"'))
    }

    return errorsArr.reduce((accumContent: any, curError: any) => {
      const openTag = `<span class="misspelledWord" data-value="${curError}">`
      const closeTag = '</span>'
      const contentParts = accumContent.split(curError)
      if (contentParts.length === 1) return contentParts[0]
      let isOmitPreviousPart: any = contentParts[0].includes('<')
      const contentWithTags = contentParts.map((part: any) => {
        const needOmitError = isErrorInsideTag(part)
        const isOmitThisPart = needOmitError === -1 ? isOmitPreviousPart : needOmitError
        const begin = isOmitPreviousPart ? '' : closeTag
        const end = isOmitThisPart ? '' : openTag
        isOmitPreviousPart = isOmitThisPart
        return `${begin}${part}${end}`
      })
      
      return removeExtraOpenTag(contentWithTags.join(curError))
    }, rawContent)
  }

  const addErrorClassToWordsPart = (separatedWords: any, content: any) => {
    const wordListCodes: any = {}
    
    const updateCodesToErrorWords = (content: any) => {
      return Object.keys(wordListCodes).reduce((accum, currentValue) => {
        const regexp = new RegExp(currentValue, 'g')
        return accum.replace(regexp, wordListCodes[currentValue])
      }, content)
    }
    
    const highLightError = (content: any, wordPartArr: any, errorWord: any) => {
      return wordPartArr.reduce((accumContent: any, curWordPart: any) => {
        const dataCode = createCode()
        wordListCodes[dataCode] = errorWord
        const newContent = accumContent.replace(
          curWordPart,
          `<span class="misspelledWord" data-value="${dataCode}">${curWordPart}</span>`
        )
        // const index = newContent.indexOf('<span class="misspelledWord"')
        return newContent
      }, content)
    }

    const updateContent = (curContent: any, errorWord: any): any => {
      // if (curContent.includes('Правовой <span class="misspelledWord">статус')) {
        // debugger
      // }
      const firstSeparatedPart = separatedWords[errorWord][0]
      const startIdx = curContent.indexOf(firstSeparatedPart)
      if (startIdx === -1) return curContent
      const contentPart = curContent.slice(startIdx)
      const prevContentPart = curContent.slice(0, startIdx)
      const cleanContentPart = getCleanContentFromHTML(contentPart)
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
    
    const contentWithErrorClasses = Object.keys(separatedWords).reduce((accumContent: any, curWord: any) => {
      return updateContent(accumContent, curWord)
    }, content)
    
    return updateCodesToErrorWords(contentWithErrorClasses)
  }
  
  function handleRemoveErrors(containersList: any) {
    if (!containersList.length) return null
    console.log('handleRemoveErrors')
    console.log('errorWordsWithParts', errorWordsWithParts)
    containersList.forEach((containerItem: any) => {
      // console.log('containerItem', containerItem.outerHTML)
      const currentContent = containerItem.innerHTML
      const updatedContent = errorWordsWithParts.reduce((accum, currentValue) => {
        const regexp = new RegExp(`<span class="misspelledWord"([\\s\\S]|[^<]*?)>${currentValue}<\\/span>`, 'g')
        const response = accum.replace(regexp, currentValue)
        if (accum.includes('ного акционера')) {
          console.log('currentValue----------', currentValue)
          console.log('accum', accum)
          console.log('response', response)
        }
        return response
      }, currentContent)
      containerItem.innerHTML = updatedContent
    })
    
    initSpellCheckScript()
  }
  
  const checkMisspelledWords = (containerElementList: any) => {
    console.log('start script')
  
    const mainContainer = document.querySelector('.qd-carcass')
    if (!mainContainer) return
    const rawContent = mainContainer.innerHTML
  
    const content = getCleanContentFromHTML(rawContent)
    const wordArr = getUniqWordArr(content)
    const separatedWords = getSeparatedWords(wordArr)
    
    // добавляем части в массив для дальшейшей очистки (вынести в отдельную функцию)
    const wordsPart = flattenSeparatedWords(separatedWords)
    errorWordsWithParts = errorWords.concat(wordsPart)
    
    containerElementList.forEach((elementItem: any) => {
      const contentFirstStepUpdate = addErrorClass(elementItem.outerHTML, errorWords)
      // console.log('contentFirstStepUpdate', contentFirstStepUpdate)
      const contentWithWordsPart = addErrorClassToWordsPart(separatedWords, contentFirstStepUpdate)
      // console.log('contentWithWordsPart', contentWithWordsPart)
      // elementItem.innerHTML = contentWithWordsPart
      elementItem.outerHTML = contentWithWordsPart
    })
  
    const containerNodeElementList1 = document.querySelectorAll('.qd-es-text')
    const containerNodeElementList2 = document.querySelectorAll('.paragraph')
    if (
      !containerNodeElementList1.length ||
      !containerNodeElementList2.length
    ) {
      return
    }
  
    const containerElementList1 = Array.from(containerNodeElementList1)
    const containerElementList2 = Array.from(containerNodeElementList2)
  
    const containerList = containerElementList1.concat(containerElementList2)
    initBtnEditAction(containerList)
  }

  function initSpellCheck(editButton: any) {
    console.log('initSpellCheck', editButton)
    const mainContainer = document.querySelector('.qd-carcass')

    if (mainContainer) {
      mainContainer.setAttribute('spellcheck', String(false))
      initMenu(mainContainer)
    }
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
        // initBtnEditAction(containerElementList)
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
  
  function toggleClass(elem: any, className: any) {
    if (elem.classList.contains(className)) elem.classList.remove(className)
    else elem.classList.add(className)
  }
  
  function initMenu(mainContainer: any) {
    const menuWrapper = document.createElement('div')
    menuWrapper.classList.add('misspelledWord-menu-wrapper')
    mainContainer.appendChild(menuWrapper)
  
    // const errorsList = document.querySelectorAll('.misspelledWord')
    // errorsList.forEach(errorElem => {
    //   errorElem.addEventListener('click')
    // })
    mainContainer.addEventListener('click', (evt: any) => {
      evt.preventDefault()
      let target = evt.target
      if (target && target.classList.contains('misspelledWord')) {

        toggleClass(menuWrapper, 'active')
      }
    }, false)
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
