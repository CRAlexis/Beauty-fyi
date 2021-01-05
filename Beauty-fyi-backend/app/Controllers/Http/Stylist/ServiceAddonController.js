'use strict'

const ServiceAddon = use('App/Models/ServiceAddon')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings

class ServiceAddonController {

  async AddServiceAddon ({ request, session, response }){

    Index = request.input('index')
    Name = request.input('name')
    Price = request.input('price')
    Duration = request.input('duration')

    // create ServiceAddon
    const serviceAddon =  await ServiceAddon.create({
      index: cleanStrings(Index, "int"),
      name: cleanStrings(Name, "string"),
      price: cleanStrings(Price, "int"),
      duration: cleanStrings(Duration, "int"),
    })

    return {"status" : "success"}

  }

}

module.exports = ServiceAddonController
