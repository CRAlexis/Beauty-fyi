'use strict'

const ScheduleAvailabilityDay = use('App/Models/ScheduleAvailabilityDay')
const Database = use('Database')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings

class ScheduleAvailabilityDayController {

  async AddScheduleAvailabilityDay ({ request, session, response }){

    //var Days = new Array("monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday")
    console.log("here")
    var userID = request.all().auth.userID

    var content = request.all().content
    var Start_time = request.all().content.startTime
    var End_time = request.all().content.endTime
    var V_Location = request.all().content.location


    Object.keys(content.days).forEach(async element => {

      console.log(element, content.days[element].applyTo)
      var applyTo = content.days[element].applyTo
      var Active = content.days[element].active
      if(applyTo){//Check if the stats apply to that day
        try{
        await Database.table('schedule_availability_days').where('user_id', userID).where('day', element).delete() //Delete the outdated results from table
        const scheduleAvailabilityDay =  await ScheduleAvailabilityDay.create({
          user_id: userID,
          active: cleanStrings(Active, "boolean"),
          day: cleanStrings(element, "string"),
          start_time: Start_time,
          end_time: End_time,
          //location: cleanStrings(V_Location, "string")
          //timezone: ""
        })
      }
      catch(e){
        console.log(e)
      }
    }
    });
  console.log("done")
    //try{
    /*// create ScheduleAvailabilityDay
    for(var i = 0; i < Days.length; i++){
      console.log("loop")
      console.log(content)
      console.log(content.Days[i])
      console.log(content.Days[i].applyTo)
      if(content.Days[i].applyTo){
        let Active = content.Days[i].active
        console.log(Active)
        const scheduleAvailabilityDay =  await ScheduleAvailabilityDay.create({
          user_id: userID,
          active: cleanStrings(Active, "boolean"),
          day: Days[i],
          start_time: cleanStrings(Start_time, "int"),
          end_time: cleanStrings(End_time, "int"),
          //location: cleanStrings(V_Location, "string")
        })
      }
      }
  }catch(e){
    console.log(e)
  }
    console.log("here 2")
*/
    return {"status" : "success"}

  }



  async GetScheduleAvailabilityDay ({ request, session, response }){
    console.log(request.all())
    var userID = request.all().auth.userID
    //userId = request.input('userId');

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
