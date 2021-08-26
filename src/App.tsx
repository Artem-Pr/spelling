import React, { useState } from 'react'

import { content3 } from './assets/resources2'
import { leftMenu } from './assets/leftMenu'

function createCode() {
  return Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0')
}

let currentWord = ''
let separatedWords:any = {}
const errors:any = {
  'акционерного': [
    {
      rightWord: 'акционерного',
      rootWords: ['акционер', 'акция', 'акцион'],
    },
    {
      rightWord: 'акционерный',
      rootWords: ['акционер', 'акция', 'акцион'],
    },
    {
      rightWord: 'акционерная',
      rootWords: ['акционер', 'акция', 'акцион'],
    },
    {
      rightWord: 'акционера',
      rootWords: ['акционер', 'акция', 'акцион'],
    },
  ],
  'единственного': [
    {
      rightWord: 'единственного',
      rootWords: ['единственный', 'единство'],
    },
    {
      rightWord: 'единственный',
      rootWords: ['единственный', 'единство'],
    },
    {
      rightWord: 'единственная',
      rootWords: ['единственный', 'единство'],
    },
  ],
  'предоставляют': [
    {
      rightWord: 'предоставляют',
      rootWords: ['предоставлять', 'предоставленный'],
    },
    {
      rightWord: 'предоставляет',
      rootWords: ['предоставлять', 'предоставленный'],
    },
    {
      rightWord: 'предоставляю',
      rootWords: ['предоставлять', 'предоставленный'],
    },
  ],
  'принимать': [
    {
      rightWord: 'принимаю',
      rootWords: ['принять', 'принимающий'],
    },
    {
      rightWord: 'принимаешь',
      rootWords: ['принять', 'принимающий'],
    },
    {
      rightWord: 'принимает',
      rootWords: ['принять', 'принимающий'],
    },
  ],
  'допускается': [
    {
      rightWord: 'допускается',
      rootWords: ['допускать', 'допускают', 'допускает'],
    },
    {
      rightWord: 'допускаются',
      rootWords: ['допускать', 'допускают', 'допускает'],
    },
    {
      rightWord: 'допускаешься',
      rootWords: ['допускать', 'допускают', 'допускает'],
    },
  ],
  'привилегированных': [
    {
      rightWord: 'привилегированных',
      rootWords: ['привилегированный', 'привилегия'],
    },
    {
      rightWord: 'привилегированный',
      rootWords: ['привилегированный', 'привилегия'],
    },
    {
      rightWord: 'привилегированная',
      rootWords: ['привилегированный', 'привилегия'],
    },
  ],
  'обыкновенные': [
    {
      rightWord: 'обыкновенные',
      rootWords: ['обыкновенно', 'обыкновение'],
    },
    {
      rightWord: 'обыкновенный',
      rootWords: ['обыкновенно', 'обыкновение'],
    },
    {
      rightWord: 'обыкновенная',
      rootWords: ['обыкновенно', 'обыкновение'],
    },
  ],
  'Тип': [
    {
      rightWord: 'Тип',
      rootWords: ['Типаж'],
    },
    {
      rightWord: 'Типовой',
      rootWords: ['Типаж'],
    },
    {
      rightWord: 'Типовая',
      rootWords: ['Типаж'],
    },
  ],
  'обществах': [
    {
      rightWord: 'обществах',
      rootWords: ['общественный', 'общество'],
    },
    {
      rightWord: 'обществам',
      rootWords: ['общественный', 'общество'],
    },
    {
      rightWord: 'общества',
      rootWords: ['общественный', 'общество'],
    },
  ],
  'статус': [
    {
      rightWord: 'статус',
      rootWords: ['статусный', 'статистика'],
    },
    {
      rightWord: 'статусы',
      rootWords: ['статусный', 'статистика'],
    },
    {
      rightWord: 'статусов',
      rootWords: ['статусный', 'статистика'],
    },
  ],
}
const errorWords = Object.keys(errors)

let errorWordsWithParts: string[] = []

const contextMenuHTML = '<ul class="misspelledWord-menu">\n' +
  '  <li class="misspelledWord-menu__item spelling">' +
  '     <img src="http://dm-kdd-srv05.dms.loc:8080/qd/public/1/carcass/default/images/expcomment.png" alt="icon" />' +
  '     <span>Правописание</span>' +
  '  </li>\n' +
  '  <li class="misspelledWord-menu__divider"></li>\n' +
  '  <li class="misspelledWord-menu__item"><img src="http://dm-kdd-srv05.dms.loc:8080/qd/public/1/carcass/default/images/expcomment.png" alt="icon" /><span>Добавить в словарь</span></li>\n' +
  '  <li class="misspelledWord-menu__item"><img src="http://dm-kdd-srv05.dms.loc:8080/qd/public/1/carcass/default/images/expcomment.png" alt="icon" /><span>Поиск в интернете</span></li>\n' +
  '  <li class="misspelledWord-menu__divider"></li>\n' +
  '  <li class="misspelledWord-menu__item"><img src="http://dm-kdd-srv05.dms.loc:8080/qd/public/1/carcass/default/images/expcomment.png" alt="icon" /><span>Вырезать</span></li>\n' +
  '  <li class="misspelledWord-menu__item"><img src="http://dm-kdd-srv05.dms.loc:8080/qd/public/1/carcass/default/images/expcomment.png" alt="icon" /><span>Копировать</span></li>\n' +
  '  <li class="misspelledWord-menu__item"><img src="http://dm-kdd-srv05.dms.loc:8080/qd/public/1/carcass/default/images/expcomment.png" alt="icon" /><span>Вставить</span></li>\n' +
  '</ul>'

function strCoordinatesToNumber(strWithPx: any) {
  return Number(strWithPx.slice(0, -2))
}

/**
 * returns the actual coordinates to the right or left of the main menu
 *
 * @param {object} mainMenuCoordinates - example: {x: '346px', y: '234px'}
 * @return {object} example: {x: '346px', y: '234px'}
 */
function getSecondLevelMenuPosition(mainMenuCoordinates: any){
  const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  const mainContextMenuWidth = 300
  const secondLevelMenuWidth = 200
  const left = strCoordinatesToNumber(mainMenuCoordinates.x)
  const secondLevelMenuLeftEdgePosition = left + mainContextMenuWidth + secondLevelMenuWidth
  const isRightSide = windowWidth > secondLevelMenuLeftEdgePosition
  return {
    y: mainMenuCoordinates.y,
    x: isRightSide ? `${left + mainContextMenuWidth}px` : `${left - secondLevelMenuWidth}px`
  }
}

function createSecondLevelSpellingMenu(coordinates: any, menuElem: any,) {
  const menuList = document.createElement('ul')
  menuList.classList.add('misspelledWord-menu')
  errors[currentWord].forEach(function(wordObj: any){
    const menuListItem = document.createElement('li')
    menuListItem.classList.add('misspelledWord-menu__item')
    const rootWordsStr = wordObj.rootWords.join(', ')
    menuListItem.innerHTML =
      '<div class="right-word">' + wordObj.rightWord + '</div>' +
      '<div class="rootWords">' + rootWordsStr + '</div>' +
      '<div class="open-third-menu-btn__wrapper"><div class="open-third-menu-btn__border"/></div>'
    menuList.appendChild(menuListItem)
  })
  
  const preparedCoordinates = getSecondLevelMenuPosition(coordinates)
  
  menuElem.appendChild(menuList)
  menuElem.style.top = preparedCoordinates.y
  menuElem.style.left = preparedCoordinates.x
  menuElem.classList.add('active')
  console.log(menuElem)
}
  
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
  
  // function addWordPartsToErrors(currentWord: any) {
  //     const targetArr = errors[currentWord]
  //     return separatedWords[currentWord].reduce(function(accum: any, wordPartArrItem: any){
  //       const updatedErrorsArr = copyByJSON(accum)
  //       accum[wordPartArrItem] = targetArr
  //       return updatedErrorsArr
  //     }, errors)
  // }

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
    // console.log('handleRemoveErrors')
    // console.log('errorWordsWithParts', errorWordsWithParts)
    containersList.forEach((containerItem: any) => {
      // console.log('containerItem', containerItem.outerHTML)
      const currentContent = containerItem.innerHTML
      containerItem.innerHTML = errorWordsWithParts.reduce((accum, currentValue) => {
        const regexp = new RegExp(`<span class="misspelledWord"([\\s\\S]|[^<]*?)>${currentValue}<\\/span>`, 'g')
        return accum.replace(regexp, currentValue)
      }, currentContent)
    })
    
    initSpellCheckScript()
  }
  
  function cleanSeparatedWords(separatedWords: any){
    const updatedObj = Object.assign(separatedWords)
    Object.keys(updatedObj).forEach(function(errorWord){
      if (!errorWords.includes(errorWord)) {
        delete updatedObj[errorWord]
      }
    })
    return updatedObj
  }
  
  const checkMisspelledWords = (containerElementList: any) => {
    console.log('start script')
  
    const mainContainer = document.querySelector('.qd-carcass')
    if (!mainContainer) return
    const rawContent = mainContainer.innerHTML
  
    const content = getCleanContentFromHTML(rawContent)
    const wordArr = getUniqWordArr(content)
    separatedWords = getSeparatedWords(wordArr)
    
    const wordsPart = flattenSeparatedWords(cleanSeparatedWords(separatedWords))
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
  
  function createContextMenu(mainContainer: any) {
    const menuWrapper = document.createElement('div')
    menuWrapper.classList.add('misspelledWord-menu__wrapper', 'menu-level1')
    menuWrapper.innerHTML = contextMenuHTML
    mainContainer.appendChild(menuWrapper)
    return menuWrapper
  }
  
  function isNotContain(elem: any, parentClass: any): any {
    if (elem.classList.contains(parentClass)) {
      return false
    } else {
      const parentElem = elem.parentElement
      return parentElem ? isNotContain(parentElem, parentClass) : true
    }
  }
  
  function removeElem(elem: any){
    elem.classList.remove('active')
    elem.innerHTML = ''
  }
  
  function initContextMenuSpellingItem(menuWrapper: any, secondContextMenuElem: any, mainContainer: any) {
    const spellingItemElem = menuWrapper.querySelector('.misspelledWord-menu__item.spelling')
    
    if (spellingItemElem) {
      spellingItemElem.addEventListener('click', function() {
        const menuWrapperCoordinates = {
          x: menuWrapper.style.left,
          y: menuWrapper.style.top
        }
        if (secondContextMenuElem.classList.contains('active')) {
          removeElem(secondContextMenuElem)
        } else {
          createSecondLevelSpellingMenu(menuWrapperCoordinates, secondContextMenuElem)
        }
      }, false)
    }
  }
  
  function initMenu(mainContainer: any) {
    let menuWrapper: any = document.querySelector('.misspelledWord-menu-wrapper')
    if (!menuWrapper) {
      menuWrapper = createContextMenu(mainContainer)
    }
  
    // выделить в функцию createSecondContextMenu
    const secondContextMenuElem = document.createElement('div')
    secondContextMenuElem.classList.add('misspelledWord-menu__wrapper', 'menu-level2')
    mainContainer.appendChild(secondContextMenuElem)
    
    mainContainer.addEventListener('click', (evt: any) => {
      evt.preventDefault()
      let target = evt.target
      if (target.classList.contains('misspelledWord')) {
        currentWord = target.getAttribute('data-value')
        menuWrapper.style.top = `${evt.pageY}px`
        menuWrapper.style.left = `${evt.pageX}px`
        menuWrapper.classList.add('active')
        removeElem(secondContextMenuElem)
      } else if (
        isNotContain(target, 'menu-level1') &&
        isNotContain(target, 'menu-level2')
      ) {
        menuWrapper.classList.remove('active')
        removeElem(secondContextMenuElem)
      }
    }, false)
  
    initContextMenuSpellingItem(menuWrapper, secondContextMenuElem, mainContainer)
  }
  
  initSpellCheckScript()

const App = () => {
  const [display, setDisplay] = useState(true)

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
