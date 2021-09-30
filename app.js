import { parseSchedules, getScheduleForDate, getFirstNextTimeIdx, dateToStrFR, datesEqual } from "./lib.js"

if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js');
};

const currentDate = new Date()
let schedules = null;
const tbody = document.querySelector("#times tbody")
const setDate = date => {
  document.getElementById("title-date").innerHTML = dateToStrFR(date)
  const schedule = getScheduleForDate(schedules, date)
  const maxLength = Math.max(...schedule.times.map(t => t.length))
  const nextIndexes = schedule.times.map(t => getFirstNextTimeIdx(t, date))
  const isToday = datesEqual(new Date(), date)
  tbody.innerHTML = ""
  for(let i=0; i < maxLength; i++) {
    if (isToday && i < nextIndexes[0] && i < nextIndexes[1]) {
      if (tbody.innerHTML == "") {
        tbody.innerHTML = "<tr><td>...</td><td>...</td></tr>"
      }
      continue
    }
    const cellsHTML = schedule.times
      .map(times => times[i] || "")
      .map((time, ii) => (isToday && i == nextIndexes[ii]) ? `<mark>${time}</mark>` : time)
      .map(time => `<td>${time}</td>`).join("\n")
    tbody.innerHTML += `<tr>${cellsHTML}</tr>`
  }
}

fetch("./schedules.json")
  .then(r => r.text())
  .then(rawSchedulesText => {
    schedules = parseSchedules(rawSchedulesText)
    setDate(currentDate)
})

const changeDateBy = (inc) => {
  currentDate.setDate(currentDate.getDate() + inc)
  setDate(currentDate)
}
