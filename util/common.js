const { vmodelBinder } = require('./index')

const config = {
  id: 'dmsdl950823@naver.com',
  pw: 'ekffkddl05'
}

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

module.exports={
  login
}