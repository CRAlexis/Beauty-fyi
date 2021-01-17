'use strict'

const { uploadMedia } = require("../../media/uploadMedia")
const AddService = use('App/Models/AddService')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings
const ServiceSteps = use('App/Models/ServiceStep')
const ServiceAddon = use('App/Models/ServiceAddon')
const Database = use('Database')
const Helpers = use('Helpers')
class AddServiceController {

  async AddService ({ request, session, response }){
    let auth;
    let content;
    let uploadedFiles
    let serviceSteps;
    let serviceAddons;
    await request.multipart.field((name, value) => {
      if (name == "auth"){auth = JSON.parse(value)}
      if (name == "content"){content = JSON.parse(value)}
    })

    uploadedFiles = await uploadMedia(request)

    // create service
    const service =  await AddService.create({
      user_id: auth.userID,
      image_one: uploadedFiles.images[0] ? uploadedFiles.images[0] : null,
      image_two: uploadedFiles.images[1] ? uploadedFiles.images[1] : null,
      image_three: uploadedFiles.images[2] ? uploadedFiles.images[2] : null,
      image_four: uploadedFiles.images[3] ? uploadedFiles.images[3] : null,
      image_five: uploadedFiles.images[4] ? uploadedFiles.images[4] : null,
      image_six: uploadedFiles.images[5] ? uploadedFiles.images[5] : null,
      name: cleanStrings(content.serviceName, "string"),
      price: /*cleanStrings(content.servicePrice, "int")*/ 30,
      category: cleanStrings(content.serviceCategory, "string"),
      description: cleanStrings(content.serviceDescription, "string"),
      rgba_colour: content.rgbaColour._argb,
      padding_before: cleanStrings(content.paddingBefore, "int"),
      padding_after: cleanStrings(content.paddingAfter, "int"),
      form: cleanStrings(content.serviceForm, "string"),
      optional_question: cleanStrings(content.optionalQuestion, "string"),
      payment_type: cleanStrings(content.paymentType, "string"),
    })

    content.serviceSteps.forEach(async element => {
      serviceSteps = await ServiceSteps.create({
        user_id: /*auth.userID*/ null,
        service_id: service.id,
        index: element.index,
        name: element.stepName ? element.stepName : "",
        duration: element.stepDuration ? element.stepDuration : 0,
        capture_footage_in_this_step: element.checked ? 1 : 0,
      })
    });
    
    content.serviceAddons.forEach(async element => {
      serviceAddons = await ServiceAddon.create({
        user_id: auth.userID,
        service_id: service.userID,
        index: element.index,
        name: element.addonName ? element.addonName : "" ,
        price: element.addonPrice ? element.addonPrice : 0,
        duration: element.addonDuration ? element.addonDuration : 0,
      })
    });

    
    return {"status" : "success"}

  }

  async GetServiceImage({ request, session, response }) {
    console.log("getting image")
    response.download(
      Helpers.tmpPath('1610829627841.png'),
    )
  }

  async getMeta({ request, session, response }) {
    //const userID = request.all().auth.userID
    //const content = request.all().content
    //const serviceID = content.serviceID
    console.log("hit")
    // const query = await Database.table('add_services').where('user_id', userID).first() ->should really look like this
    try {
      const query = await Database.table('add_services').where('price', 30).paginate(1, 2)
      console.log(query)
      
    } catch (error) {
      console.log(error)
    }
    
    let responseObject = []
    //responseObject.push({
    //  serviceID: query.id,
    //  //active: query.active
    //})
    return responseObject
  }

  async getServiceData({ request, session, response }) { 
    const userID = request.all().auth.userID
    const content = request.all().content
    const serviceID = content.serviceID
    const row = content.row
    console.log("row number " + row)
    let continueRequests = true
    console.log("ServiceID " + serviceID)
    try {
      const query = await Database.table('add_services').where('price', 30).paginate(row, 3)
      let total = query.total
      let page = query.page
      let perPage = query.perPage
      if (page * perPage >= total){
        console.log("dont continue")
        continueRequests = false
      }else{
        console.log("continue requests")
        continueRequests = true
      }
      
      return { service: query.data, continueRequests: continueRequests }
    } catch (error) {
      console.log(error)
    }
    
  }

}

module.exports = AddServiceController
