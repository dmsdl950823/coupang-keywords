// 기간 초기 선택
async function setDuration (page) {
  await page.waitForTimeout(400)

  const durationRangeWrapper = '.duration-range-wrapper'
  const datepicker = durationRangeWrapper + ' .date-picker-input.category-date-picker'
  await page.waitForSelector(datepicker)
  const pickers = await page.$$(`${datepicker}`)
  await pickers[1].click()
}

export default {
  setDuration
}