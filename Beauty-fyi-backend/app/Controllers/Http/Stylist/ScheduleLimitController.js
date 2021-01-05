'use strict'

const ScheduleLimit = use('App/Models/ScheduleLimit')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings

class ScheduleLimitController {

  async AddScheduleLimit ({ request, session, response }){
    const { minimumHoursBeforeAppointment, maximumDaysInAdvance, rescheduleAppointments, cancelAppointments, maximumHoursForReschedule, avoidGaps, allowGaps, gapHours } = request.all()
    console.log(request.body)
    console.log("2")

    // create ScheduleLimit
    const scheduleLimit =  await ScheduleLimit.create({
      user_id: null,
      minimumHoursBeforeAppointment: cleanStrings(minimumHoursBeforeAppointment, "int"),
      maximumDaysInAdvance: cleanStrings(maximumDaysInAdvance, "int"),
      rescheduleAppointments: cleanStrings(rescheduleAppointments, "boolean"),
      cancelAppointments: cleanStrings(cancelAppointments, "boolean"),
      maximumHoursForReschedule: cleanStrings(maximumHoursForReschedule, "int"),
      avoidGaps: cleanStrings(avoidGaps, "boolean"),
      allowGaps: cleanStrings(allowGaps, "boolean"),
      gapHours: cleanStrings(gapHours, "int")
    })

    console.log("4")

    return {"status" : "success"}

  }

  async GetScheduleLimit ({ request, session, response }){
    console.log(request.all())
    userId = request.input('userId');

    //Get data by user_id
    const schedulelimit = await ScheduleLimit.query().where('user_id', userId)

    return {"status" : "success", "scheduleavailability" : schedulelimit}
  }

}

module.exports = ScheduleLimitController
