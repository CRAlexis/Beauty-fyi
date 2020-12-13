'use strict'

const ScheduleLimit = use('App/Models/ScheduleLimit')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings

class ScheduleLimitController {

  async AddScheduleLimit ({ request, session, response }){

    Minimum_hours_for_reschedule = request.input('minimum_hours_for_reschedule')
    Maximum_days_for_schedule_in_future = request.input('maximum_days_for_schedule_in_future')
    Allow_clients_to_reschedule_or_cancel = request.input('allow_clients_to_reschedule_or_cancel')
    Hours_in_advance_they_can_reschedule_or_cancel = request.input('hours_in_advance_they_can_reschedule_or_cancel')
    Avoid_gaps_between_appointments_during_the_day = request.input('avoid_gaps_between_appointments_during_the_day')
    Allow_gaps = request.input('allow_gaps')
    Allow_gaps_up_to = request.input('allow_gaps_up_to')

    // create ScheduleLimit
    const scheduleLimit =  await ScheduleLimit.create({
      minimum_hours_for_reschedule: cleanStrings(Minimum_hours_for_reschedule, "int"),
      maximum_days_for_schedule_in_future: cleanStrings(Maximum_days_for_schedule_in_future, "int"),
      allow_clients_to_reschedule_or_cancel: cleanStrings(Allow_clients_to_reschedule_or_cancel, "boolean"),
      hours_in_advance_they_can_reschedule_or_cancel: cleanStrings(Hours_in_advance_they_can_reschedule_or_cancel, "int"),
      avoid_gaps_between_appointments_during_the_day: cleanStrings(Avoid_gaps_between_appointments_during_the_day, "boolean"),
      allow_gaps: cleanStrings(Allow_gaps, "boolean"),
      allow_gaps_up_to: cleanStrings(Allow_gaps_up_to, "int")
    })

    return {"status" : "success"}

  }

}

module.exports = ScheduleLimitController
