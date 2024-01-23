const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const downloadPath = '/Users/jejung/Downloads'; // 다운로드된 파일의 경로로 변경

async function changeFileName (index = 0) { // 1월부터 시작
  // 파일 읽어오기
  const files = fs.readdirSync(downloadPath);
  const targetFiles = files.filter(file => file.startsWith('itemscout_io') && file.endsWith('.xlsx'));
  
  console.log(targetFiles);

  // 파일 이름 변경
  for (const file of targetFiles) {
    const oldFilePath = path.join(downloadPath, file);
    const newFileName = `month_${index + 1}.xlsx` // 1월 ~ 12월
    const newFilePath = path.join(downloadPath, newFileName);

    fs.renameSync(oldFilePath, newFilePath);
    console.log(`# Renamed file: ${file} => ${newFileName}`);
  }
}

async function deleteMonthFiles () {
  // `month_`로 시작하는 모든 .xlsx 파일 삭제
  const files = fs.readdirSync(downloadPath);
  const monthFiles = files.filter(file => file.startsWith('month_') && file.endsWith('.xlsx'));

  for (const monthFile of monthFiles) {
    const filePath = path.join(downloadPath, monthFile);
    fs.unlinkSync(filePath);
    console.log(`Deleted file: ${monthFile}`);
  }
}

async function saveExcelFiles (newFileName = 'new_excel') {
  // 파일 읽어오기
  const files = fs.readdirSync(downloadPath);
  const savedFiles = files.filter(file => file.startsWith('month_') && file.endsWith('.xlsx'));


  const saveArea = `${downloadPath}/keywords`
  const saveFileName = `${newFileName}.xlsx`

   // 새로운 엑셀 파일 생성
   let newExcelFilePath = path.join(saveArea, saveFileName);
  //  const workbook = xlsx.utils.book_new();
    let workbook;
    if (fs.existsSync(newExcelFilePath)) {
      // 기존 파일이 존재하면 불러오기
      workbook = xlsx.readFile(newExcelFilePath);
    } else {
      // 기존 파일이 없으면 새로운 엑셀 파일 생성
      workbook = xlsx.utils.book_new();
      newExcelFilePath = path.join(saveArea, saveFileName);
    }

    // 시트의 이름을 파일 목록의 숫자로 지정
  for (let i = 0; i < 12; i++) {
    const file = `month_${i + 1}.xlsx`
    const sheetName = `${i + 1}월`;

    // 엑셀 파일 읽기
    const filePath = path.join(downloadPath, file);
    const workbookRead = xlsx.readFile(filePath);;

    // 첫 번째 시트의 데이터를 CSV로 추출하여 Array에 저장
    const firstSheet = workbookRead.Sheets[workbookRead.SheetNames[0]];
    const csvData = xlsx.utils.sheet_to_csv(firstSheet);
    const csvArray = csvData.split('\n').map(row => row.split(','));

    // Array의 데이터를 시트에 추가
    const sheet = xlsx.utils.aoa_to_sheet(csvArray);
    xlsx.utils.book_append_sheet(workbook, sheet, sheetName);

    console.log(`Added data from ${file} to ${sheetName}`);
  }

  // 새로운 엑셀 파일 저장
  if (!fs.existsSync(saveArea)) fs.mkdirSync(saveArea, { recursive: true });

  // 새로운 엑셀 파일 저장
  xlsx.writeFile(workbook, newExcelFilePath);
  console.log(`New Excel file created: ${newExcelFilePath}`);

  // 파일 저장하고 마무리
  // deleteMonthFiles()
}

// 파일 사용 방법
// changeFileName(1)
// changeFileName(2)
// changeFileName(3)
// changeFileName(4)
// ...

// saveExcelFiles('니트스웨터')
// saveExcelFiles('텍스트2')

// 파일 모두 삭제
// deleteMonthFiles()

module.exports={
  changeFileName,
  saveExcelFiles,
  deleteMonthFiles
}

