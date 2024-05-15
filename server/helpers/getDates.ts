export function getDates(startDate: Date, endDate: Date) {
  const dates: Array<Date> = [];
  let currentDate: Date = startDate;
  const addDays = function (days: number) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };
  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate = addDays.call(currentDate, 1);
  }
  return dates;
}
