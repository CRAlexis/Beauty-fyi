'use strict'
const { uploadMedia } = require("../../media/uploadMedia")
const Mail = use('Mail')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings
const Database = use('Database')
const Appointment = use('App/Models/Appointment')
const StripeController = use('App/Controllers/Http/Payment/StripeController')
const stripeController = new StripeController()
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

  async getAvailableTimes({ request }) {
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

      //let locationID = scheduleAvailability.location_id;



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

      await new Promise((resolve, reject) => {
        if (addonIDs.length > 0) {
          console.log("addon id length: " + addonIDs.length)
          let index = 0
          addonIDs.forEach(async element => {
            let addon = await Database.table("service_addons").where('id', element).first()
            //console.log("Addon duration: " + addon.duration)
            serviceTime += parseInt(addon.duration)
            index++
            if (index == addonIDs.length) {
              resolve()
            }
          })
        } {
          resolve()
        }
      })

      
      const serviceBackEndDuration = paddingBefore + paddingAfter + serviceTime
      const appointments = await Database.table("appointments").where('user_id', userID)
      console.log("service duration: " + serviceBackEndDuration)

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

            console.dir(bookedAppointmentTimes)
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
                  status: "success", times: times, duration: serviceTime
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
                status: "success", times: times, duration: serviceTime
              }
            }
          } else {
            console.log("There are no appointments on this day")
            let hour = minimumTime.slice(0, 2);
            let minute = minimumTime.slice(3, 5);
            //console.log(minimumTime)
            //if (minimumTimeHour.toString().length == 1) { hour = "0" + minimumTimeHour } else { hour = minimumTimeHour }
            //if (minimumTimeMinute.toString().length == 1) { minute = "0" + minimumTimeMinute } else { minute = minimumTimeHour }
            const times = [{
              hour: hour,
              minute: minute
            }]
            return {
              status: "success", times: times, duration: serviceTime
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
              return { status: "success", times: legalDatesFormatted, duration: serviceTime }
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
              return { status: "success", times: legalDates, duration: serviceTime }
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
            return { status: "success", times: legalDates, duration: serviceTime }
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

  async createAppointment({ request, session, response }) {
    //const trx = await Database.beginTransaction()
    
      let auth;
      let content;
      let uploadedFiles
      let serviceSteps;
      let serviceAddons;
    try {
      await request.multipart.field((name, value) => {
        console.log("in here")
        if (name == "auth") { auth = JSON.parse(value) }
        if (name == "content") { content = JSON.parse(value) }
      })

      //uploadedFiles = await uploadMedia(request, "serviceMedia")
      
      console.log(content)
      const service = Database.table("services").where('id', content.serviceID).first()
      const paddingBefore = service.padding_before
      const paddingAfter = service.padding_after

      let duration = content.duration
      let stylistStartTime = this.addHoursAndMinutes(content.time, -paddingBefore, true)
      let stylistEndTime = this.addHoursAndMinutes(content.time, parseInt(duration + paddingAfter), true)
      let clientEndTime = this.addHoursAndMinutes(content.time, duration, true)

      console.log(duration, stylistStartTime, stylistEndTime, clientEndTime, paddingBefore, paddingAfter)

      
      // add information to database
      /*Appointment.create({
        user_id: auth.userID,
        client_id: content.clientID,
        service_id: content.serviceID,
        addon_ids: content.addons.toString(),
        appointment_date: content.date,
        stylist_start_time: stylistStartTime,
        stylist_end_time: stylistEndTime,
        client_start_time: content.time,
        client_end_time: clientEndTime,
       })*/
      // send invoice
      // update transactions table
      // send emails
      // phone notification
      //await trx.commit()
    } catch (error) {
      // /uploadedFiles.images.forEach(async element => {
       // await Drive.delete(element)
      // /})
// /
      // /await trx.rollback()
     console.log(error)
    }
  }

  async getConsultationQuestions({ request }) {
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

  async getServiceReceipt({ request }) {
    try {
      console.log(0)
      const userID = request.all().auth
      const content = request.all().content
      const serviceID = content.serviceID
      const addonIDs = content.addons
      let receiptArray = []
      const service = await Database.table("services").where('id', serviceID).first()
      receiptArray.push({
        serviceName: service.name,
        servicePrice: service.price,
      })
      if (addonIDs.length > 0) {
        await new Promise((resolve) => {
          // Need to check if this still fires even when array is empty
          let index = 0
          addonIDs.forEach(async element => {
            const addon = await Database.table("service_addons").where("id", element).first()
            receiptArray.push({
              serviceName: addon.name,
              servicePrice: addon.price,
            })
            index++
            if (index == addonIDs.length) {
              resolve()
            }
          });
        })
      }

      let deposit = 0;
      let total = 0;
      switch (service.payment_type) {
        case "Require 50% deposit":
          receiptArray.forEach(element => {
            total += element.servicePrice
          })
          deposit = total / 2
          break;

        case "Require full payment":
          receiptArray.forEach(element => {
            total += element.servicePrice
          })
          break;
        case "Do not accept online payments":
          receiptArray.forEach(element => {
            total += element.servicePrice
          })
          break;
      }
      receiptArray.push(
        {
          serviceName: "Deposit",
          servicePrice: deposit
        },
        {
          serviceName: "Total",
          servicePrice: total,
        }
      )
      console.log(receiptArray)
      return { status: "success", receipt: receiptArray }
    } catch (error) {
      console.log(error)
      return { status: "error" }

    }
  }

  async clientEmailGetBool({ request, response }) {
    try {
      const userID = request.all().auth.userID
      const clientID = request.all().content.clientID
      const serviceID = request.all().content.serviceID
      const service = await Database.table("services").where('id', serviceID).first()
      if (service.payment_type == "Do not accept online payments") {
        return { status: "success", email: null }
      }
      const isClient = await Database.table("user_clients").where('user_id', userID).where('client_id', clientID).first()
      if (isClient) {
        const client = await Database.table("users").where("id", clientID).first()
        if (!client.email.includes("unknown_")) {
          return { status: "success", email: client.email }
        } else {
          return { status: "enter email" }
        }
      } else {
        return { status: "error" }
      }
    } catch (error) {
      console.log(error)
    }
  }

  async clientEmailAppend({ request }) {
    const trx = await Database.beginTransaction()
    const userID = request.all().auth.userID
    const clientID = request.all().content.clientID
    let Email = cleanStrings(request.all().content.email.trim(), "email")
    const isClient = await Database.table("user_clients").where('user_id', userID).where('client_id', clientID).first()
    if (isClient) {
      const client = await Database.table("users").where("id", clientID).update({ 'email': Email }, trx)
      await trx.commit()
      console.log("appending client email: " + client + " with client_id: " + clientID)
      return await new Promise((resolve, reject) => {
        stripeController.createCustomerNonHttp(clientID, Email).then(async (result) => {
          console.log("Creating stripe_attrs for new user")
          resolve()
        }, (e) => {
          console.log("Unable to create stripe_attrs for new user")
          reject()
        })
      }).then(() => {
        return { status: "success", clientID: clientID }
      }, (e) => {
        return { status: "only email", clientID: clientID }
      })
    } else {
      //await trx.rollback()
      return false
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

  addHoursAndMinutes(time1, minutes, string = false) {
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
    if (string){
      return hour + ":" + minute + ":00"
    }else{
      return { hour: newHour, minute: newMinute }
    }
   
  }

}

module.exports = AppointmentController
