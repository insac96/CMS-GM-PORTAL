import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'

declare global {
  var DayJS : any
}

export default defineNitroPlugin(async (nitroApp) => {
  dayjs.extend(weekOfYear)
  global.DayJS = dayjs
})
