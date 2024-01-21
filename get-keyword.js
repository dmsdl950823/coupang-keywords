const puppeteer = require('puppeteer');

async function crawlMenu() {
  const browser = await puppeteer.launch({
    headless: false, // 브라우저를 화면에 표시하지 않을 경우 주석 해제
    // args: ['--proxy-server=http://your-proxy-server:port'], // 프록시 사용 시 주석 해제하고 주소 설정
  });

  const page = await browser.newPage();

  try {
    // 웹 페이지로 이동
    await page.goto('https://itemscout.io/category');

    // await page.waitForSelector('.menu-list') // [아이템 발굴] 메뉴 선택
    // await page.click('.menu-list > .menu')
    
    // // const tutorial = await page.$('#tutorialTooltip')
    // const container = '.category-dropdown-container'
    // await page.waitForSelector(container) // [아이템 발굴] 메뉴 선택
    // await page.click(`${container} > div`)




    // await menuList.click('.menu'); // ".menu-list"의 첫 번째 자식 ".menu" 요소를 클릭

    // const menuItems = await menuList.$eval(items => items.map(item => item.textContent.trim()));
    // const menuItems = await menuList.$$eval('li', items => items.map(item => item.textContent.trim()));
    // console.log(menuList);

    // menuItems.forEach((menuItem, index) => {
    //   console.log(`Menu Item ${index + 1}: ${menuItem}`);
    // });
  } catch (error) {
    console.error('Error during crawling:', error.message);
  } finally {
    // 브라우저 닫기
    // await browser.close();
  }
}

// 크롤러 실행
crawlMenu();
