'use strict'

const ScheduleAvailabilityDay = use('App/Models/ScheduleAvailabilityDay')
const Database = use('Database')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings

class ScheduleAvailabilityDayController {

  async setavailability({ request, session, response }) {
    let userID = request.all().auth.userID
    let content = request.all().content
    let V_Location = request.all().content.location

    Object.keys(content.days).forEach(async element => {
      var applyTo = content.days[element].applyTo
  
      if (applyTo) {//Check if the stats apply to that day
        try {
          const dayCheck = await Database.select('day').from('schedule_availability_days').where("day", element).where("user_id", userID).first()
          if (dayCheck) {        
            const affectedRows = await Database
              .table('schedule_availability_days')
              .where('day', element).where("user_id", userID)
              .update({
                user_id: userID,
                start_time: content.startTime,
                end_time: content.endTime,
                //location: cleanStrings(V_Location, "string")
                //timezone: ""
              })
            console.log("updating schedule settings")
          } else {
            const scheduleAvailabilityDay = await ScheduleAvailabilityDay.create({
              user_id: userID,
              active: 1,
              day: element,
              start_time: content.startTime,
              end_time: content.endTime,
              //location: cleanStrings(V_Location, "string")
              //timezone: ""
            })
            console.log("creating new schedule settings")
          }
        }
        catch (e) {
          console.log(e)
        }
      }
    });
    console.log("done")
    return { "status": "success" }

  }



  async setDayActive({ request, session, response }) {
    //console.log(request.all())
    const content = request.all().content
    const userID = request.all().auth.userID
    try {
      Object.keys(content).forEach(async element => {
        let active = content[element].active
        const affectedRows = await Database
          .table('schedule_availability_days')
          .where('day', element).where("user_id", userID)
          .update({
            active: active
          })
      })
    } catch (error) {
      console.log(error)
    }
    console.log("Change schedule active days")
    return { "status": "success" }

  }

  async setavailabilityget({ request, session, response }) {
    let userID
    if (request.all().content.userID){
      userID = request.all().content.userID
    }else{
      userID = request.all().auth.userID
    }
    
    try {
      const query = await Database.table('schedule_availability_days').where('user_id', userID)
      console.log("getting schedule data")
      return { "status": "success", schedule: query }
    } catch (error) {
      return { "status": "error" }
    }
    
  }


}


module.exports = ScheduleAvailabilityDayController
