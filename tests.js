import { parseSchedules, getScheduleForDate, parseDate, getFirstNextTimeIdx, datesEqual } from "./lib.js"
import { readFileSync } from "fs"

const runTests = (tests) =>
  tests.forEach(([name, condition]) => {
    if (condition) {
      console.log(`✅ ${name}`)
    } else {
      console.log(`❌ ${name}`)
    }
  })


const rawJson = readFileSync("./schedules.json", "utf-8");

const schedules = parseSchedules(rawJson)
console.log(schedules[0])

// 1. test schedules parsing
runTests([
  ["loads 2 different times schedules", schedules.length == 2],
  ["parses range from dates", datesEqual(schedules[0].ranges[0].from, new Date(2021, 8, 27))], // month indexes
  ["parses range until dates", datesEqual(schedules[0].ranges[0].until, new Date(2021, 9, 22))] // month indexes
])

// 2. test schedule finding
runTests([
  ["gets correct schedule autumn start day monday", getScheduleForDate(schedules, parseDate("27/09/2021")).name == "Service réduit"],
  ["gets correct schedule autumn other monday", getScheduleForDate(schedules, parseDate("04/10/2021")).name == "Service réduit"],
  ["gets correct schedule autumn saturday", getScheduleForDate(schedules, parseDate("09/10/2021")).name == "Service intensif"],
  ["gets correct schedule autumn sunday", getScheduleForDate(schedules, parseDate("10/10/2021")).name == "Service intensif"],
  ["gets correct schedule autumn end date friday", getScheduleForDate(schedules, parseDate("22/10/2021")).name == "Service réduit"],
  ["gets correct schedule holidays 1 start date saturday", getScheduleForDate(schedules, parseDate("23/10/2021")).name == "Service intensif"],
  ["gets correct schedule holidays 1 monday", getScheduleForDate(schedules, parseDate("26/10/2021")).name == "Service intensif"],
  ["gets correct schedule holidays 2 end date sunday", getScheduleForDate(schedules, parseDate("07/11/2021")).name == "Service intensif"],
  ["gets correct schedule winter start date monday", getScheduleForDate(schedules, parseDate("08/11/2021")).name == "Service réduit"],
  ["gets correct schedule winter saturday", getScheduleForDate(schedules, parseDate("13/11/2021")).name == "Service réduit"],
  ["gets correct schedule winter end date friday", getScheduleForDate(schedules, parseDate("17/12/2021")).name == "Service réduit"],
])

// 3. test get first next time
const testTimes = ["06h35", "10h22", "16h00", "18h30"]
runTests([
  ["gets next time when before first ", getFirstNextTimeIdx(testTimes, new Date(2021, 10, 10, 3, 22)) == 0],
  ["gets next time when in between 1", getFirstNextTimeIdx(testTimes, new Date(2021, 10, 10, 7, 22)) == 1],
  ["gets next time when in between 2", getFirstNextTimeIdx(testTimes, new Date(2021, 10, 10, 17, 0)) == 3],
  ["gets next day first time when after last", getFirstNextTimeIdx(testTimes, new Date(2021, 10, 10, 20, 0)) == 0],
])
