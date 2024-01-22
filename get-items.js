const puppeteer = require('puppeteer');
const fs = require('fs/promises'); // Node.js의 fs.promises 모듈을 사용
const resultfile = require('./dist/result.json')


async function init () {
  const browser = await puppeteer.launch({
    headless: false, // 브라우저를 화면에 표시하지 않을 경우 주석 해제
    // args: ['--proxy-server=http://your-proxy-server:port'], // 프록시 사용 시 주석 해제하고 주소 설정
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1020,890','--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'],
    slowMo: 10,
  });

  const page = await browser.newPage();

  await crawlpage(page)
}

/**
 * 저장한 JSON 데이터 목록 풀어 String 으로 저장하기
 * @param {*} object 
 * @returns 
 */
function formatJSON (object) {
  let keys = []
  for (const key1 in object) {
    for (const key2 in object[key1]) {
      for (const key3 in object[key1][key2]) {
        const items = [key1, key2, key3].join('').replace(/\//gi, '')
        keys.push(items)
      }
    }
  }
  // console.log(keys)
  return keys
}


async function crawlpage(page, params = '') {
  const result = formatJSON(resultfile)
  // console.log(result);

  try {
    // 웹 페이지로 이동
    await page.goto('https://itemscout.io/category');

    // 광고 제거
    await page.waitForTimeout(1500)
    await page.waitForSelector('.its-modal')
    await page.evaluate((classSelector) => {
      const elements = document.querySelectorAll(classSelector);
      elements.forEach(element => element.remove());
    }, '.its-modal')
    

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
    }, result[0])


    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    
    

  } catch (error) {
    
  }


}
// async function crawlpage(page, params = '') {
//   try {
//     let selects = await categories.$$('.select')

//     /**
//      * 클릭하고, 하단 열어서 N 번째 클릭
//      * @param {Number} no 
//      * @param {Number} idx 
//      */
//     const openLists = async (no, idx) => {
//       if (!selects[no]) return false

//       await selects[no].click() // 3카테고리까지 열가 위함
//       const cates = await selects[no].$$('.select_list > li')
      
//       // console.log(cates);
//       if (cates[idx]) await cates[idx].click()
//     }

//     /**
//      * 다시 "select" 영역을 재할당하는 부분
//      */
//     const reassign = async () => {
//       // 3차는 없다가 생기는거라서 다시 호출
//       await page.waitForTimeout(500);
//       return categories.$$('.select')
//     }

//     /**
//      * 리스트의 개수 확인
//      * @param {Number} no
//      * @returns {Number}
//      */
//     const counts = async (no) => {
//       if (!selects[no]) return 0

//       selects = await reassign()
//       const cates = await selects[no].$$('.select_list > li')
//       return cates.length
//     }

//     const getText = async text => {
//       const array = []

//       for (let i = 0; i < 3; i++) { // 3차 분류까지만 할거임
//         const item = selects[i];
//         const text = await item.$eval('.select_btn', el => el.textContent)
//         array.push(text)
//       }

//       // console.log(array)
//       const key0 = array[0]
//       const key1 = array[1]
//       const key2 = array[2]

//       // 1차 분류
//       if (!result[key0]) result[key0] = { [key1]: {} }

//       if (key1 === undefined) return
      
//       // 2차 분류
//       if (!result[key0][key1]) result[key0][key1] = { [key2]: {} }
    
//       if (key2 === undefined) return

//       // 3차 분류
//       if (!result[key0][key1][key2]) result[key0][key1][key2] = true // 빈 값
//       // console.log(result)
//     }

//     // 🍒
//     let idx0 = 0
//     let idx1 = 0
//     let idx2 = 0

//     await openLists(0, idx0)
//     await openLists(1, idx1)
//     selects = await reassign()
//     await openLists(2, idx2)


//     console.log(getCurrentTime(), '초기 세팅 완료, 시작 ...!');
//     console.log('--------');
//     // console.log(item0, item1, item2, 'G;;?');

//     while (true) {
//       // N 번째 카테고리의 리스트를 클릭함
      
//       const item0 = await counts(0)
//       const item1 = await counts(1)
//       const item2 = await counts(2)

//       console.log(getCurrentTime(), '@@ category start >>>', `${idx0} (${item0}), ${idx1} (${item1}), ${idx2} (${item2})`)
      
//       if (idx2 === item2) {
//         console.log('-- CHANGE 2 --');
//         idx1 += 1
//         idx2 = 0

//         await openLists(1, idx1)
//         selects = await reassign()
//         await openLists(2, idx2)
//         continue
//       }

//       if (idx1 === item1) {
//         console.log('-- CHANGE 1 --');
//         idx0 += 1
//         idx1 = 0
//         idx2 = 0

//         await openLists(0, idx0)
//         await openLists(1, idx1)
//         selects = await reassign()
//         await openLists(2, idx2)
//         continue
//       }

//       if (idx0 === item0) {
//         console.log(getCurrentTime(), '==== END! ====')
//         break
//       }

//       await openLists(2, idx2)


//       idx2 += 1 // 3단계 위주로 움직임
//       await getText()
//     }

//     await saveJSONFile(result)

//   } catch (error) {
//     console.error('Error during crawling:', error.message);
//     await saveJSONFile(result)
//   } finally {
//     // 브라우저 닫기
//     // await browser.close();
//   }
// }

// 크롤러 실행
init();
