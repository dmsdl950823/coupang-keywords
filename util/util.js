
/**
 * vue 프로젝트일 경우, v-model 을 외부에서 바인딩해주어야함
 * @param {HTMLInputElement} input
 * @param {String} text 입력할 텍스트
 */
const vmodelBinder = (input, text) => {
  input.value = text;

  const event = new Event('input', { bubbles: true });
  input.dispatchEvent(event);
}


/**
 * 현재 시간 (실행 시간) 표기
 * @returns {String}
 */
function getCurrentTime () {
  const now = new Date();

  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  const currentTime = `${hours}:${minutes}:${seconds}`;
  return currentTime
}


const puppeteerHeader = {
  headless: false, // 브라우저를 화면에 표시하지 않을 경우 주석 해제
  // args: ['--proxy-server=http://your-proxy-server:port'], // 프록시 사용 시 주석 해제하고 주소 설정
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1020,890','--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"', '--disable-notifications'],
  slowMo: 10,
  // defaultArgs: [ // 권한 허용
  //   '--use-fake-ui-for-media-stream',
  //   '--use-fake-device-for-media-stream',
  //   '--enable-features=WebNotifications',
  // ]
}

module.exports={
  vmodelBinder,
  puppeteerHeader,
  getCurrentTime
}