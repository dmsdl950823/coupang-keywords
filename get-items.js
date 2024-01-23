/**
 * 아이템 스카우트에서 가져온 키워드를 바탕으로 데이터를 검색 한 후,
 * 인기있는 키워드를 1월 ~ 12월 계절별로 엑셀로 다운로드한다.
 * 엑셀로 모두 다운로드 받은 경우, 하나의 엑셀을 새로 만들어서 1월 ~ 12월 시트를 삽입한우,
 * 마지막으로 그 전에 다운로드 받았던 엑셀 파일들은 모두 삭제시킨다.
 */

const puppeteer = require('puppeteer');
const fs = require('fs/promises'); // Node.js의 fs.promises 모듈을 사용

const { changeFileName, saveExcelFiles, deleteMonthFiles } = require('./change-filename')

const colors = require('./util/colors.js')
const { login, formatJSON } = require('./util/common.js')
const { getCurrentTime,  puppeteerHeader } = require('./util/util.js')

// 카테고리 목록 저장된 내용
const categories = require('./dist/result.json')


/**
 * 실행
 */
async function init () {
  const browser = await puppeteer.launch(puppeteerHeader);
  const page = await browser.newPage();

  const cateList = formatJSON(categories)
  const cookies = await settingLogin(page, browser) // 쿠키 저장

  for (let i = 0; i < cateList.length; i++) {
    const name = cateList[i]
    await crawlpage({ browser, cookies, name, idx: i })
  }
}

// 광고 제거
async function closeAD (page) {
  // await page.waitForTimeout(1500)
  await page.waitForSelector('.btn-cancel')
  const cancelButton = await page.$$('.btn-cancel')
  await cancelButton[2].click()
}

// 🌸 디버깅용 광고 제거
async function closeAD_Debugger (page) {
  await page.waitForTimeout(1500)
  await page.waitForSelector('.btn-cancel')
  const cancelButton = await page.$$('.btn-cancel')
  await cancelButton[2].click()

  await page.waitForSelector('.close-text')
  const closeButton = await page.$('.close-text')
  await closeButton.click()
}

async function settingLogin (newPage, browser) {
  await login(newPage)
  await closeAD(newPage)

  const cookies = await newPage.cookies();
  // console.log(cookies);
  return cookies
}

/**
 * 엑셀 다운로드 버튼 클릭
 * @param {*} page 
 */
async function excelDownload (page) {
  const resultTable = '.keyword-table-options-container'
  await page.waitForSelector(resultTable)
  const exceldownload = await page.$(`${resultTable} .excel-download-button`)
  await exceldownload.click()
}


async function crawlpage({ browser, cookies, name, idx }) {
  try {
    // 🌸 디버깅용 - 로그인 생략할때만 사용
    // const page = await newPage

    // 정상 동작시 로그인부터 해야합니당
    const page = await browser.newPage();
    await page.setCookie(...cookies);
    // ------ /. 로그인, 쿠키 세팅 ------

    console.log(`${colors.bgYellow}${getCurrentTime()} | ## IDX: ${idx}, [${name}] START ===`, colors.reset)

    // 웹 페이지로 이동
    await page.goto('https://itemscout.io/category', { waitUntil: 'domcontentloaded' }); // 다른 페이지로 이동 시까지 대기
    
    await page.waitForTimeout(1000)

    console.log(`${getCurrentTime()} | - Start Searching Title...`)
    // input 창 입력 시작
    await page.waitForSelector('.category-selector-title');
    const labelSwitch = await page.$('.category-selector-title .vue-js-switch')
    await labelSwitch.click()
    
    const inputSelector = '.category-dropdown-wrapper'
    await page.waitForSelector(inputSelector)
    await page.waitForTimeout(500)
    await page.$eval(`${inputSelector} input`, (input, text) => {
      input.value = text
      input.focus()

        // Vue의 change 이벤트를 발생시키기 (필요에 따라)
      const event1 = new Event('input', { bubbles: true });
      input.dispatchEvent(event1);
    }, name)


    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    

    console.log(`${getCurrentTime()} | - Start Setting Search Option...`)


    // 검색 조건 설정 (🌸 디버깅시 검색조건은 전체 주석처리하고 디버깅)
    const optionWrapper = '.options-toggle-wrapper'
    await page.waitForSelector(optionWrapper)
    const optionsWrappers = await page.$$(optionWrapper)

    // 키워드 유형 - [정보성]
    const keywordTypes = await optionsWrappers[0].$$('label')
    await keywordTypes[1].click()

    // 브랜드 키워드 - [브랜드 제거]
    const brandKeyword = await optionsWrappers[1].$('.option')
    await brandKeyword.click()


    console.log(`${getCurrentTime()} | - Start Setting Duration...`)

    // 기간 설정
    const durationContainer = '.duration-type-container'
    await page.waitForSelector(durationContainer)
    const durationButtons = await page.$$(`${durationContainer} > .duration-button`)
    await durationButtons[1].click()

    // await closeAD_Debugger(page) // 디버깅용 🌸

    await page.waitForTimeout(400)
    const durationRangeWrapper = '.duration-range-wrapper'
    const datepicker = durationRangeWrapper + ' .date-picker-input.category-date-picker'
    await page.waitForSelector(datepicker)
    const pickers = await page.$$(`${datepicker}`)
    await pickers[1].click()
    
    // 작년 1월로 자동 세팅 (*초기화)
    const pickerpop = '.v-date-picker-table'
    await page.waitForSelector(pickerpop)
    const picker2 = await page.$(`${pickerpop} > table > tbody > tr:nth-child(1) > td:nth-child(1)`)
    await picker2.click()


    console.log(`${getCurrentTime()} | - Start Excel Downloading...`)

    // [조회] 버튼 클릭
    const durationButton = await page.$(`${durationRangeWrapper} .btn-apply-duration`)
    await durationButton.click()

    await page.waitForTimeout(2000) // 데이터 response 대기 시간 있을 수 있음

    await excelDownload(page) // 1월 ~ 12월 엑셀 데이터 저장
    await page.waitForTimeout(2000) // 다운로드가 덜 되었을 때 동작하면 안됨

    await changeFileName(0)



    // 1월부터 12월까지 순차적으로 진행
    for (let i = 1; i < 12; i++) {
      await page.waitForTimeout(3000) // 너무 빨리 돌리면 못찾는 이슈가 있음 ㅠ

      await pickers[0].click() // start datepicker 클릭
  
      const tds = `.menuable__content__active ${pickerpop} > table > tbody td`
      await page.waitForSelector(tds)

      const monthButtons = await page.$$(tds) // 1월 ~ 12월 선택
      await monthButtons[i].click()

      await durationButton.click() // [조회] 버튼
      // console.log(i);

      await page.waitForTimeout(2000)

      await excelDownload(page) // 1월 ~ 12월 엑셀 데이터 저장
      await page.waitForTimeout(2000) // 다운로드가 덜 되었을 때 동작하면 안됨

      await changeFileName(i)
    }
    
    console.log(`${getCurrentTime()} | - Save in One Excel and Delete All Extra Files ...`)
    await saveExcelFiles(name) // 파일 이름으로 따로 시트에 저장
    await deleteMonthFiles() // month 관련된 파일 모두 삭제

    console.log(`${getCurrentTime()} |  - Done`)
    await page.close()
  } catch (error) {
    console.log(`${colors.bgRed}${getCurrentTime()} | ## Error !!! => IDX: ${idx}, [${name}] ###`, colors.reset)
    console.log(`${colors.fgRed}${error} \n\n`, colors.reset)
  }
}

// 크롤러 실행
init();
