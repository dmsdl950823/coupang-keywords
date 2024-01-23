const { vmodelBinder } = require('./util.js')

const config = {
  id: 'dmsdl950823@naver.com',
  pw: 'ekffkddl05'
}

/**
 * 로그인 함수 (로그인 하려면 사용)
 */
async function login (page) {
  await page.goto('https://itemscout.io/login');

  const slot = '.session-page form span'
  
  
  await page.$eval(`${slot}:nth-child(1) input`, vmodelBinder, config.id)
  await page.$eval(`${slot}:nth-child(2) input`, vmodelBinder, config.pw)

  const submit = '.session-page button'
  const buttons = await page.$$(submit)
  await buttons[1].click()

  await page.waitForTimeout(3000)
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

module.exports={
  login,
  formatJSON
}