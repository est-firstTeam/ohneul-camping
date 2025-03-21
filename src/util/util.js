export function commaNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 2025-01-01을 n월n일로 리턴
export function monthDateFormat(dateString) {
  const splited = dateString.split("-");
  const month = splited[1].replace(/^0/, "");
  const date = splited[2].replace(/^0/, "");
  const result = `${month}월 ${date}일`;
  return result;
}
