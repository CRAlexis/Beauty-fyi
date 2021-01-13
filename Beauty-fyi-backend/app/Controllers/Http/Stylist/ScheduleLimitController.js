'use strict'

const ScheduleLimit = use('App/Models/ScheduleLimit')
const Database = use('Database')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings

class ScheduleLimitController {

  async AddScheduleLimit ({ request, session, response }){
    console.log("1")
    var userID = request.all().auth.userID

    var MinimumHoursBeforeAppointment = request.all().content.minimumHoursBeforeAppointment
    var MaximumDaysInAdvance = request.all().content.maximumDaysInAdvance
    var RescheduleAppointments = request.all().content.rescheduleAppointments
    var CancelAppointments = request.all().content.cancelAppointments
    var MaximumHoursForReschedule = request.all().content.maximumHoursForReschedule
    var AvoidGaps = request.all().content.avoidGaps
    var AllowGaps = request.all().content.allowGaps
    var GapHours = request.all().content.gapHours
    console.log("2")

    //Remove all data connected to the user_id before adding data
    await Database.table('schedule_limits').where('user_id', userID).delete() //Delete the outdated results from table
    // create ScheduleLimit
    const scheduleLimit =  await ScheduleLimit.create({
      user_id: userID,
      minimumHoursBeforeAppointment: cleanStrings(MinimumHoursBeforeAppointment, "int"),
      maximumDaysInAdvance: cleanStrings(MaximumDaysInAdvance, "int"),
      rescheduleAppointments: cleanStrings(RescheduleAppointments, "boolean"),
      cancelAppointments: cleanStrings(CancelAppointments, "boolean"),
      maximumHoursForReschedule: cleanStrings(MaximumHoursForReschedule, "int"),
      avoidGaps: cleanStrings(AvoidGaps, "boolean"),
      allowGaps: cleanStrings(AllowGaps, "boolean"),
      gapHours: cleanStrings(GapHours, "int")
    })

    console.log("3")

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
