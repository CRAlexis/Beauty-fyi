'use strict'

const ScheduleAvailabilityDay = use('App/Models/ScheduleAvailabilityDay')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings

class ScheduleAvailabilityDayController {

  async AddScheduleAvailabilityDay ({ request, session, response }){

    Active = request.input('active')
    Start_time = request.input('start_time')
    End_time = request.input('end_time')
    V_Location = request.input('location')

    // create ScheduleAvailabilityDay
    const scheduleAvailabilityDay =  await ScheduleAvailabilityDay.create({
      active: cleanStrings(Active, "boolean"),
      start_time: cleanStrings(Start_time, "int"),
      end_time: cleanStrings(End_time, "int"),
      location: cleanStrings(V_Location, "string")
    })

    return {"status" : "success"}

  }

}

module.exports = ScheduleAvailabilityDayController
