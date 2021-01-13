'use strict'

const ServiceStep = use('App/Models/ServiceStep')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings

class ServiceStepController {

  async AddServiceStep ({ request, session, response }){

    var Index = request.all().content.index
    var Name = request.all().content.name
    var Duration = request.all().content.duration
    var Capture_footage_in_this_step = request.all().content.capture_footage_in_this_step

    // create cameraStep
    const serviceStep =  await ServiceStep.create({
      index: cleanStrings(Index, "int"),
      name: cleanStrings(Name, "string"),
      duration: cleanStrings(Duration, "int"),
      capture_footage_in_this_step: cleanStrings(Capture_footage_in_this_step, "boolean"),
    })

    return {"status" : "success"}

  }

}

module.exports = ServiceStepController
