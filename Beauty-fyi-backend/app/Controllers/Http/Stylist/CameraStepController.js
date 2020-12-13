'use strict'

const CameraStep = use('App/Models/CameraStep')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings

class CameraStepController {

  async AddCameraStep ({ request, session, response }){

    Index = request.input('index')
    Name = request.input('name')
    Duration = request.input('duration')
    Capture_footage_in_this_step = request.input('capture_footage_in_this_step')
    Padding_before = request.input('padding_before')
    Padding_after = request.input('padding_after')

    // create cameraStep
    const cameraStep =  await CameraStep.create({
      index: cleanStrings(Index, "int"),
      name: cleanStrings(Name, "string"),
      duration: cleanStrings(Duration, "int"),
      capture_footage_in_this_step: cleanStrings(Capture_footage_in_this_step, "boolean"),
      padding_before: cleanStrings(Padding_before, "int"),
      padding_after: cleanStrings(Padding_after, "int")
    })

    return {"status" : "success"}

  }

}

module.exports = CameraStepController
