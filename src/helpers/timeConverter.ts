export const timeConverter = (fullDate: string): Date => {
  let [day, month, date, year, time] = fullDate
    ? fullDate?.split(' ')
    : ['', '', '', '', ''];
  const [hh, mm, ss] = time ? time?.split(':') : ['', '', ''];

  const modMonth =
    month === 'Jan'
      ? 0
      : month === 'Feb'
      ? 1
      : month === 'Mar'
      ? 2
      : month === 'Apr'
      ? 3
      : month === 'May'
      ? 4
      : month === 'Jun'
      ? 5
      : month === 'Jul'
      ? 6
      : month === 'Aug'
      ? 7
      : month === 'Sep'
      ? 8
      : month === 'Oct'
      ? 9
      : month === 'Nov'
      ? 10
      : month === 'Dec'
      ? 11
      : 0;

  return fullDate
    ? new Date(
        Number(year),
        modMonth,
        Number(date),
        Number(hh),
        Number(mm),
        Number(ss)
      )
    : new Date();
};
