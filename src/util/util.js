export function commaNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 2025-01-01을 n월n일로 리턴
export function monthDateFormat(dateString) {
  if (dateString) {
    const splited = dateString.split("-");
    const month = splited[1].replace(/^0/, "");
    const date = splited[2].replace(/^0/, "");
    const result = `${month}월 ${date}일`;
    return result;
  }
  return "-";
}

// 두 날짜 사이의 일을 계산하여 숫자로 리턴
export function getDaysBetweenDates(startDate, endDate) {
  // 문자열을 Date 객체로 변환
  const start = new Date(startDate);
  const end = new Date(endDate);

  // 시간, 분, 초, 밀리초를 0으로 설정하여 날짜만 고려
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  // 밀리초 단위로 차이 계산
  const diffTime = Math.abs(end - start);

  // 밀리초를 일 단위로 변환 (1일 = 24시간 * 60분 * 60초 * 1000밀리초)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
