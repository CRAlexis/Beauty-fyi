'use strict'

const Mail = use('Mail')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings
const Database = use('Database')
const Appointment = use('App/Models/Appointment')
const dateFormat = require("dateformat");

class AppointmentController {

  async appointmentConfirmed({ request }) {
    const data = request.only(['email', 'username', 'password'])
    const user = await User.create(data)

    await Mail.send('auth.emails.appointment.confirmed.edge', user.toJSON(), (message) => {
      message
        .to(user.email)
        .from('<from-email>')
        .subject('Your appointment is confirmed')
    })

    return 'Registered successfully'
  }

  async appointmentOneDayReminder({ request }) {
    const data = request.only(['email', 'username', 'password'])
    const user = await User.create(data)

    await Mail.send('auth.emails.appointment.oneDayReminder.edge', user.toJSON(), (message) => {
      message
        .to(user.email)
        .from('<from-email>')
        .subject('Your appointment is tomorrow')
    })

    return 'Registered successfully'
  }

  async appointmentUpdated({ request }) {
    const data = request.only(['email', 'username', 'password'])
    const user = await User.create(data)

    await Mail.send('auth.emails.appointment.updated.edge', user.toJSON(), (message) => {
      message
        .to(user.email)
        .from('<from-email>')
        .subject('Your upcoming appointment has been updated')
    })

    return 'Registered successfully'
  }

  async getAvailableTimes({ request, view, response, auth }) {
    try {
      const auth = request.all().auth
      const content = request.all().content
      const clientID = content.clientID
      const serviceID = content.serviceID
      const addonIDs = content.addonIDs
      const userID = auth.userID
      const date = content.date
      const todayDate = new Date()
      let minimumTime;
      let maximumTime;
      let day = dateFormat(date, "dddd").toLowerCase()
      let month = dateFormat(date, "mm")
      let year = dateFormat(date, "yyyy")
      //console.log(day, month, year)

      const scheduleAvailability = await Database.table("schedule_availability_days")
        .where('user_id', userID).where("day", day).first()
      if (scheduleAvailability.active) {
        console.log("The stylist is working on this day")
        minimumTime = scheduleAvailability.start_time
        maximumTime = scheduleAvailability.end_time
      } else {
        console.log("The stylist is not working today")
        return { status: "no times" }
      }

      let minimumTimeHour = parseInt(minimumTime.slice(0, 2))
      let minimumTimeMinute = parseInt(minimumTime.slice(3, 5))
      let maximumTimeHour = parseInt(maximumTime.slice(0, 2))
      let maximumTimeMinute = parseInt(maximumTime.slice(3, 5))

      let allTimes = [] // All possible times within opening and closing times
      while (minimumTimeHour <= maximumTimeHour) {
        let hour
        let minute
        if (minimumTimeHour == maximumTimeHour) {
          if (minimumTimeMinute < maximumTimeMinute) {
            minimumTimeMinute += 15
            if (minimumTimeMinute == 60) {
              minimumTimeMinute = 0
              minimumTimeHour += 1
            }
          } else {
            break;
          }
        } else {
          minimumTimeMinute += 15
          if (minimumTimeMinute == 60) {
            minimumTimeMinute = 0
            minimumTimeHour += 1
          }
        }
        if (minimumTimeHour.toString().length == 1) { hour = "0" + minimumTimeHour } else { hour = minimumTimeHour }
        if (minimumTimeMinute.toString().length == 1) { minute = "0" + minimumTimeMinute } else { minute = minimumTimeMinute }
        allTimes.push({ hour: hour, minute: minute })
      }

      const scheduleLimits = await Database.table("schedule_limits").where('user_id', userID).first()
      const maximumDaysInAdvance = scheduleLimits.maximumDaysInAdvance
      if (this.dateDiffInDays(todayDate, new Date(date)) > maximumDaysInAdvance) { //Date is too far in the future
        console.log("Too far in the future ( reset )")
        //return { status: "no times" }
      }

      //get service length
      const service = await Database.table("services").where('id', serviceID).first()
      const paddingBefore = service.padding_before ? parseInt(service.padding_before) : 0
      const paddingAfter = service.padding_after ? parseInt(service.padding_after) : 0
      const serviceSteps = await Database.table("service_steps").where('service_id', serviceID)
      const avoidGaps = scheduleLimits.avoidGaps
      const gapHours = scheduleLimits.gapHours
      let serviceTime = 0
      if (serviceSteps.length > 0) {
        serviceSteps.forEach(async element => {
          serviceTime += parseInt(element.duration)
        })
      }
      const serviceBackEndDuration = paddingBefore + paddingAfter + serviceTime
      const appointments = await Database.table("appointments").where('user_id', userID)

      if (avoidGaps) {
        //console.log("avoid gaps")
        let appointmentsWithSameDayIndex = []
        let bookedAppointmentTimes = []
        if (appointments.length > 0) {
          appointments.forEach(element => {
            if (this.sameDay(element.appointment_date, new Date(date))) {
              appointmentsWithSameDayIndex.push(element.id)
              //console.log("this appointment has the same day: " + element.id)
            }
          })
          if (appointmentsWithSameDayIndex.length > 1) {
            await new Promise((resolve) => {
              let index = 0
              appointmentsWithSameDayIndex.forEach(async element => {
                const appointment = await Database.table("appointments").where('id', element).first()
                bookedAppointmentTimes.push({
                  startTime: appointment.stylist_start_time,
                  endTime: appointment.stylist_end_time
                })
                index++
                if (index == appointmentsWithSameDayIndex.length) { resolve() }
              })
            })

            //get service length backend -> serviceBackEndDuration
            let lastAppointment = bookedAppointmentTimes[0].endTime
            try {
              bookedAppointmentTimes.every((element, index) => {
                let currentHour = parseInt(bookedAppointmentTimes[0].endTime.slice(0, 2))
                let potentialHour = parseInt(element.endTime.slice(0, 2))
                if (currentHour > potentialHour) { return true }
                if (currentHour == potentialHour) {
                  let currentMinute = parseInt(bookedAppointmentTimes[0].endTime.slice(3, 5))
                  let potentialMinute = parseInt(element.endTime.slice(3, 5))
                  if (currentMinute >= potentialMinute) { return true }
                }
                lastAppointment = element.endTime  //get appointment with the latest end time
                return true
              })
            } catch (error) {
              console.log(error)
            }

            const potentialEndAppointment = this.addHoursAndMinutes(lastAppointment, serviceBackEndDuration)
            let potentialEndAppointmentHour = potentialEndAppointment.hour
            let potentialEndAppointmentMinute = potentialEndAppointment.minute
            let lastAppointmentHour = lastAppointment.slice(0, 2)
            let lastAppointmentMinute = lastAppointment.slice(3, 5)

            //console.dir(bookedAppointmentTimes)
            //console.log("last appointment hour: " + lastAppointmentHour, "last appointment minute: " + lastAppointmentMinute)
            //console.log("potential end hour: " + potentialEndAppointmentHour, "potential end minute: " + potentialEndAppointmentMinute)
            //console.log("minimumTime: " + minimumTime, "maximumTime: " + maximumTime)
            if (potentialEndAppointmentHour > maximumTimeHour) {
              //return
              console.log("appointment ending too late 1")
              return { status: "no times" }
            } else if (potentialEndAppointmentHour == maximumTimeHour) {
              if (potentialEndAppointmentMinute > maximumTimeMinute) {
                console.log("appointment ending too late 2")
                return { status: "no times" }
              } else {
                let hour;
                let minute;
                if (lastAppointmentHour.toString().length == 1) { hour = "0" + lastAppointmentHour } else { hour = lastAppointmentHour }
                if (lastAppointmentMinute.toString().length == 1) { minute = "0" + lastAppointmentMinute } else { minute = lastAppointmentMinute }
                const times = [{
                  hour: hour,
                  minute: minute
                }]
                return {
                  status: "success", times: times
                }
              }
            } else {
              let hour;
              let minute;
              if (lastAppointmentHour.toString().length == 1) { hour = "0" + lastAppointmentHour } else { hour = lastAppointmentHour }
              if (lastAppointmentMinute.toString().length == 1) { minute = "0" + lastAppointmentMinute } else { minute = lastAppointmentMinute }
              const times = [{
                hour: hour,
                minute: minute
              }]
              return {
                status: "success", times: times
              }
            }
          } else {
            console.log("There are no appointments on this day")
            let hour;
            let minute;
            if (minimumTimeHour.toString().length == 1) { hour = "0" + minimumTimeHour } else { hour = minimumTimeHour }
            if (minimumTimeMinute.toString().length == 1) { minute = "0" + minimumTimeMinute } else { minute = minimumTimeHour }
            const times = [{
              hour: hour,
              minute: minute
            }]
            return {
              status: "success", times: times
              // Return first availible time
            }
          }
        }
      } else {
        console.log("Allow gaps")
        let appointmentsWithSameDayIndex = []
        let bookedAppointmentTimes = []
        if (appointments.length > 0) {
          appointments.forEach(element => {
            if (this.sameDay(element.appointment_date, new Date(date))) {
              appointmentsWithSameDayIndex.push(element.id)
              //console.log("this appointment has the same day: " + element.id)
            }
          })
          if (appointmentsWithSameDayIndex.length > 1) {
            await new Promise((resolve) => {
              let index = 0
              appointmentsWithSameDayIndex.forEach(async element => {
                const appointment = await Database.table("appointments").where('id', element).first()
                bookedAppointmentTimes.push({
                  startTime: appointment.stylist_start_time,
                  endTime: appointment.stylist_end_time
                })
                index++
                if (index == appointmentsWithSameDayIndex.length) { resolve() }
              })
            })
            let lastAppointmentEndTime = bookedAppointmentTimes[0].endTime

            bookedAppointmentTimes.every((element, index) => { //get appointment with the latest end time
              let currentHour = parseInt(bookedAppointmentTimes[0].endTime.slice(0, 2))
              let potentialHour = parseInt(element.endTime.slice(0, 2))
              if (currentHour > potentialHour) { return true }
              if (currentHour == potentialHour) {
                let currentMinute = parseInt(bookedAppointmentTimes[0].endTime.slice(3, 5))
                let potentialMinute = parseInt(element.endTime.slice(3, 5))
                if (currentMinute >= potentialMinute) { return true }
              }
              lastAppointmentEndTime = element.endTime
              return true
            })

            console.log(bookedAppointmentTimes)
            let legalDates = await new Promise((resolve) => {
              let legalDates = []
              let index = 0
              allTimes.forEach(element => {
                const potentialTimes = this.addHoursAndMinutes(element.hour + ":" + element.minute, serviceBackEndDuration)
                const potentialStartTimeHour = parseInt(element.hour)
                const potentialStartTimeMinute = parseInt(element.minute)
                const potentialEndTimeHour = parseInt(potentialTimes.hour)
                const potentialEndTimeMinute = parseInt(potentialTimes.minute)
                bookedAppointmentTimes.every((appointmentTimes, index) => {
                  if (potentialEndTimeHour < parseInt(appointmentTimes.startTime.slice(0, 2)) || // Check if the hours dont overlap
                    potentialStartTimeHour > parseInt(appointmentTimes.endTime.slice(0, 2))) {
                    if (index == bookedAppointmentTimes.length - 1) { // It will only get here if it never returned false and its on the last index
                      //console.log("1)" + potentialStartTimeHour + ":" + potentialStartTimeMinute + " - " + potentialEndTimeHour + ":" + potentialEndTimeMinute)
                      legalDates.push(element)
                    }
                    return true
                  } else if (potentialEndTimeHour == parseInt(appointmentTimes.startTime.slice(0, 2)) && potentialEndTimeMinute <= parseInt(appointmentTimes.startTime.slice(3, 5))) {
                    if (index == bookedAppointmentTimes.length - 1) {
                      //console.log("2)" + potentialStartTimeHour + ":" + potentialStartTimeMinute + " - " + potentialEndTimeHour + ":" + potentialEndTimeMinute)
                      legalDates.push(element)
                    }
                    return true
                  } else if (potentialStartTimeHour == parseInt(appointmentTimes.endTime.slice(0, 2)) && potentialStartTimeMinute >= parseInt(appointmentTimes.endTime.slice(3, 5))) {
                    if (index == bookedAppointmentTimes.length - 1) {
                      //console.log("3)" + potentialStartTimeHour + ":" + potentialStartTimeMinute + " - " + potentialEndTimeHour + ":" + potentialEndTimeMinute)
                      legalDates.push(element)
                    }
                    return true
                  }
                  return false
                })
                index++
                if (index == allTimes.length) { resolve(legalDates) }
              })
            })
            console.log("latest appointment: " + lastAppointmentEndTime)
            let legalDatesIndex = 0
            let legalDatesFormatted = []
            legalDates.forEach(element => {
              const potentialTimes = this.addHoursAndMinutes(element.hour + ":" + element.minute, serviceBackEndDuration)
              const potentialStartTimeHour = parseInt(element.hour)
              const potentialStartTimeMinute = parseInt(element.minute)
              const potentialEndTimeHour = parseInt(potentialTimes.hour)
              const potentialEndTimeMinute = parseInt(potentialTimes.minute)
              bookedAppointmentTimes.every((appointmentTimes, index) => {
                if (potentialEndTimeHour == (parseInt(appointmentTimes.startTime.slice(0, 2)) - gapHours)) { // If they are on the same hour it checks minutes
                  if (potentialEndTimeMinute > parseInt(appointmentTimes.startTime.slice(3, 5))) {
                    //console.log("1)" + potentialStartTimeHour, ":", parseInt(element.minute))
                    legalDatesFormatted.push(element)
                    return false
                  }
                } else
                  if (potentialStartTimeHour == (parseInt(appointmentTimes.endTime.slice(0, 2)) + gapHours)) { // If they are on the same hour it checks minutes
                    if (potentialStartTimeMinute < parseInt(appointmentTimes.endTime.slice(3, 5))) {
                      //console.log("2)" + potentialStartTimeHour, ":", parseInt(element.minute))
                      legalDatesFormatted.push(element)
                      return false
                    }
                  } else if (potentialEndTimeHour > (parseInt(appointmentTimes.startTime.slice(0, 2)) - gapHours) && // Otherwise it only check hours
                    potentialStartTimeHour < (parseInt(appointmentTimes.endTime.slice(0, 2)) + gapHours)) {
                    //console.log("3)" + potentialStartTimeHour, ":", parseInt(element.minute))
                    legalDatesFormatted.push(element)
                    return false
                  } else { // If no good it cycles to the next appointment booking time - to see if it is in the range of that time
                    return true
                  }
              })
              legalDatesIndex++
            })
            if (legalDatesFormatted.length > 2) {
              return { status: "success", times: legalDatesFormatted }
            } else {
              return { status: "no times" }
            }
          } else {
            console.log("1) No appointments found - So give default date")
            let legalDates = [] // No appointments founds - So any date within gap hours from minimum time hour
            allTimes.forEach(element => {
              const potentialStartTimeHour = parseInt(element.hour)
              if ((potentialStartTimeHour < parseInt(minimumTime.slice(0, 2)) + gapHours)) {
                legalDates.push(element)
              }
            })
            if (legalDates.length > 0) {
              return { status: "success", times: legalDates }
            } else {
              return { status: "no times" }
            }
          }
        } else {
          console.log("2) No appointments found - So give default date")
          let legalDates = [] // No appointments founds - So any date within gap hours from minimum time hour
          allTimes.forEach(element => {
            const potentialStartTimeHour = parseInt(element.hour)
            if ((potentialStartTimeHour < parseInt(minimumTime.slice(0, 2)) + gapHours)) {
              legalDates.push(element)
            }
          })
          if (legalDates.length > 0) {
            return { status: "success", times: legalDates }
          } else {
            return { status: "no times" }
          }
        }
      }


    } catch (error) {
      console.log(error)
      return { status: "no times" }
    }
  }

  async getConsultationQuestions({ request, view, response, auth }){
    try {
      const userID = request.all().auth
      const content = request.all().content
      const serviceID = content.serviceID
      const service = await Database.table("services").where('id', serviceID).first()
      console.log(service.form_id)
      const formID = service.form_id
      const questions = await Database.table("service_questions").where('form_id', formID)
      let questionsArray = []
      questions.forEach(element => {
        questionsArray.push({
          id: element.id,
          questionIndex: element.question_index,
          questionTypeIndex: element.question_type_index,
          question: element.question,
          questionOptions: element.question_options,
        })
      })
      return { status: "success", form: questionsArray }
    } catch (error) {
      console.log(error)
    }
  }


  dateDiffInDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }

  sameDay(d1, d2) {
    return d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();
  }

  addHoursAndMinutes(time1, minutes) {
    let time1Hour = parseInt(time1.slice(0, 2))
    let time1Minute = parseInt(time1.slice(3, 5))
    let minutesToAdd = minutes + time1Minute
    let hoursToAdd = 0;
    if (minutesToAdd > 59) {
      hoursToAdd = parseInt(((minutes + time1Minute) / 60).toString().split(".")[0])
      minutesToAdd = ((minutes + time1Minute) % 60)
    }
    let newHour = time1Hour + hoursToAdd
    let newMinute = minutesToAdd
    while (newMinute > 59) {
      newHour += 1
      newMinute -= 60
    }
    return { hour: newHour, minute: newMinute }
  }

}

module.exports = AppointmentController
