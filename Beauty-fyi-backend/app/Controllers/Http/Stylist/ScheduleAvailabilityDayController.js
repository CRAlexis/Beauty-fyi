'use strict'

const ScheduleAvailabilityDay = use('App/Models/ScheduleAvailabilityDay')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings

class ScheduleAvailabilityDayController {

  async AddScheduleAvailabilityDay ({ request, session, response }){
    console.log(request.all())


    Active = request.input('active')
    Day = request.input('day')
    Start_time = request.input('start_time')
    End_time = request.input('end_time')
    V_Location = request.input('location')

    // create ScheduleAvailabilityDay
    const scheduleAvailabilityDay =  await ScheduleAvailabilityDay.create({
      user_id: null,
      active: cleanStrings(Active, "boolean"),
      day: cleanStrings(Day, "string"),
      start_time: cleanStrings(Start_time, "int"),
      end_time: cleanStrings(End_time, "int"),
      location: cleanStrings(V_Location, "string")
    })

    return {"status" : "success"}

  }



  async GetScheduleAvailabilityDay ({ request, session, response }){
    console.log("here 2");
    console.log(request.all())
    //userId = request.input('userId');
    var userId = null;

    //Get data by user_id
    try{
    const scheduleavailability = await ScheduleAvailabilityDay.query().where('user_id', userId).fetch()
    console.log(scheduleavailability)
    }catch(Exception){
      console.log(Exception)
    }


    return {"status" : "success", "scheduleavailability" : 10}

  }



}


module.exports = ScheduleAvailabilityDayController
