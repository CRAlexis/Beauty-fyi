'use strict'

const ScheduleLimit = use('App/Models/ScheduleLimit')
const Database = use('Database')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings

class ScheduleLimitController {

  async addScheduleLimit ({ request, session, response }){
    try {
      var userID = request.all().auth.userID
      const check = await Database.select('user_id').from('schedule_limits').where("user_id", userID).first()
      if (check) {
        const affectedRows = await Database
          .table('schedule_limits')
          .where("user_id", userID)
          .update({
            minimumHoursBeforeAppointment: cleanStrings(request.all().content.minimumHoursBeforeAppointment, "int"),
            maximumDaysInAdvance: cleanStrings(request.all().content.maximumDaysInAdvance, "int"),
            rescheduleAppointments: cleanStrings(request.all().content.rescheduleAppointments, "boolean"),
            cancelAppointments: cleanStrings(request.all().content.cancelAppointments, "boolean"),
            maximumHoursForReschedule: cleanStrings(request.all().content.maximumHoursForReschedule, "int"),
            avoidGaps: cleanStrings(request.all().content.avoidGaps, "boolean"),
            allowGaps: cleanStrings(request.all().content.allowGaps, "boolean"),
            gapHours: cleanStrings(request.all().content.gapHours, "int"),
          })
        console.log("Updated schedule limit", affectedRows)
      } else {
        const scheduleLimit = await ScheduleLimit.create({
          user_id: userID,
          minimumHoursBeforeAppointment: cleanStrings(request.all().content.minimumHoursBeforeAppointment, "int"),
          maximumDaysInAdvance: cleanStrings(request.all().content.maximumDaysInAdvance, "int"),
          rescheduleAppointments: cleanStrings(request.all().content.rescheduleAppointments, "boolean"),
          cancelAppointments: cleanStrings(request.all().content.cancelAppointments, "boolean"),
          maximumHoursForReschedule: cleanStrings(request.all().content.maximumHoursForReschedule, "int"),
          avoidGaps: cleanStrings(request.all().content.avoidGaps, "boolean"),
          allowGaps: cleanStrings(request.all().content.allowGaps, "boolean"),
          gapHours: cleanStrings(request.all().content.gapHours, "int"),
        })
        console.log("created new schedule limit")
      }
      return { "status": "success" }
    } catch (error) {
      //error catching
      console.log(error)
    }
    

  }

  async getScheduleLimit ({ request, session, response }){
    console.log("hit")
    let userID
    if (request.all().content.userID) {
      userID = request.all().content.userID
    } else {
      userID = request.all().auth.userID
    }
    try {
      const query = await Database.table('schedule_limits').where('user_id', userID).first()
      console.log("getting schedule limit data")
      return { "status": query? "success" : "error", scheduleLimits: query? query : false }
    } catch (error) {
      return { "status": "error" }
    }
  }

}

module.exports = ScheduleLimitController
