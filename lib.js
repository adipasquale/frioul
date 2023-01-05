const parseDate = (dateStr) => {
  const s = dateStr.split("/")
  return new Date(`${s[2]}-${s[1]}-${s[0]}`) // regular constructor uses month indexes 🤷
}

const parseRange = (range) => {
  range.from = parseDate(range.from)
  range.until = parseDate(range.until)
  range.until.setDate(range.until.getDate() + 1)
}

const parseSchedules = (rawSchedulesText) => {
  const schedules = JSON.parse(rawSchedulesText)
  schedules.forEach(schedule =>
    schedule.ranges.forEach(parseRange)
  )
  return schedules
}

const dateCoveredByRange = (date, range) =>
  date >= range.from &&
  date <= range.until &&
  (range.days == "all"
    || (range.days == "weekend" && [6, 0].includes(date.getDay())))

const getScheduleForDate = (schedules, date) =>
  schedules.find(schedule =>
    schedule.ranges.some(range => dateCoveredByRange(date, range))
  )

const timeStrIsAfterDate = (timeStr, date) => {
  const [hour, minutes] = timeStr.split(" ")[0].split("h").map(i => parseInt(i, 10))
  return (hour == date.getHours() && minutes >= date.getMinutes()) ||
    hour > date.getHours()
}

const getFirstNextTimeIdx = (times, date) => {
  const idx = times.findIndex(time => timeStrIsAfterDate(time, date))
  return idx < 0 ? 0 : idx
}

const pad = n => n <= 9 ? `0${n}` : n

const dateToStrFR = date => {
  const d = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
  return `${d[date.getDay()]} ${pad(date.getDate())}/${pad(date.getMonth() + 1)}`
}

const datesEqual = (d1, d2) => d1.getDate() == d2.getDate() &&
  d1.getMonth() == d2.getMonth() &&
  d1.getYear() == d2.getYear()

export { parseSchedules, getScheduleForDate, parseDate, getFirstNextTimeIdx, dateToStrFR, datesEqual }
