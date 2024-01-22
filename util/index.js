
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

export { getCurrentTime }