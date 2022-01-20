const X = require("xlsx");

function readExcel(fileName, sheetName = undefined) {
  const workbook = X.readFile(fileName);
  const sheet_name_list = workbook.SheetNames;
  const sheet = sheetName || sheet_name_list[0];
  const ws = workbook.Sheets[sheet];

  return X.utils.sheet_to_json(ws, { header: 0 });
}

function writeExcel(
  fileName,
  data,
  excelProps = undefined,
  sheetName = undefined
) {
  var wb = X.utils.book_new();
  sheetName = sheetName || "data";

  excelProps && (wb.Props = excelProps);

  wb.SheetNames.push(sheetName);

  var ws = X.utils.json_to_sheet(data);

  wb.Sheets[sheetName] = ws;

  X.writeFile(wb, fileName);
}

module.exports = {
  readExcel,
  writeExcel,
};
